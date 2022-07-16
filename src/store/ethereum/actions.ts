/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { providers, utils, Contract } from 'ethers';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { EthereumStateInterface } from './state';

import * as Abi from 'src/constants/abi';
import { CassiniTxStatus, Transaction, TransactionStatus, TransactionType, TransactionWithRelated } from 'src/models';
import { getCassiniTxs } from 'src/services';
import { cassiniStatusConverter } from 'src/common/cassini';
import { toErc20btsg } from 'src/common/numbers';

import { Dialog } from 'quasar';
import MessageDialog from 'src/components/MessageDialog.vue';

let provider: providers.Web3Provider;
let subscription: NodeJS.Timeout;
let subscriptionBridge: NodeJS.Timeout;

const actions: ActionTree<EthereumStateInterface, StateInterface> = {
  async connectMetamask({ commit, dispatch }) {
    try {
      // set loading
      commit('setLoadingMetamask', true);
      commit('setAddress', null);

      // detect provider
      const metamask = await detectEthereumProvider();

      // if provider not found
      if (!metamask) {
        throw new Error('Unable to detect MetaMask');
      }

      if (window.ethereum) {
        await (window.ethereum as MetaMaskInpageProvider).enable();

        const chainId = await (window.ethereum as MetaMaskInpageProvider).request({ method: 'eth_chainId' });

        if (chainId !== process.env.VUE_APP_NETWORK) {
          throw new Error(`Wrong network, please select ${process.env.VUE_APP_NETWORK}`);
        }

        provider = new providers.Web3Provider((window.ethereum as providers.ExternalProvider));
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        commit('setAddress', address);

        dispatch('getBalance').catch(error => console.error(error));

        dispatch('unsubscribe').catch(error => { throw error; });
        dispatch('subscribe').catch(error => { throw error; });
        dispatch('subscribeBridge').catch(error => { throw error; });
      }
    } catch (err) {
      console.error(err);
      commit('setAddress', null);

      Dialog.create({
        component: MessageDialog,
        componentProps: {
          title: 'errors.title',
          subtitle: 'errors.metamaskConnection',
          success: false
        },
      });

      throw err;
    } finally {
      commit('setLoadingMetamask', false)
    }
  },
  async getBalance({ state, commit, dispatch }, allowance = true) {
    try {
      const contract = new Contract(
        process.env.VUE_APP_BTSG_CONTRACT,
        Abi.balanceOf,
        provider
      );

      const balance = await contract.balanceOf(state.address);

      commit('setBalance', balance);

      if (allowance) {
        dispatch('getAllowance').catch(error => console.error(error));
      }
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Eth get balance failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    }
  },
  async getAllowance({ state, commit }) {
    try {
      commit('setLoadingAllowance', true);
      const contract = new Contract(
        process.env.VUE_APP_BTSG_CONTRACT,
        Abi.allowance,
        provider
      );

      const allowance = await contract.allowance(
        state.address,
        process.env.VUE_APP_BRIDGE_CONTRACT
      );

      const result = allowance.lt(state.balance);
      commit('setApprove', result);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Eth get allowance failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    } finally {
      commit('setLoadingAllowance', false);
    }
  },
  async setApprove({ commit, dispatch, state }) {
    try {
      commit('setApproveLoading', true)

      const signer = provider.getSigner();

      const contract = new Contract(
        process.env.VUE_APP_BTSG_CONTRACT,
        Abi.setApprove,
        signer
      );

      const tx = await contract.approve(
        process.env.VUE_APP_BRIDGE_CONTRACT,
        utils.parseUnits(state.balance.toString(), 18)
      );

      await dispatch('unsubscribe');
      await dispatch('addPendingTransaction', {
        id: state.pendingTransactions.length,
        hash: tx.hash,
        status: 'PENDING',
        time: Date.now(),
        to: process.env.VUE_APP_BTSG_CONTRACT,
        sender: state.address,
        type: TransactionType.APPROVE
      });
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Approve failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    } finally {
      commit('setApproveLoading', false);
    }
  },
  async deposit({ commit, dispatch, state }, { to, amount }: { to: string, amount: string }) {
    try {
      commit('setDepositLoading', true)

      const signer = provider.getSigner();

      const contract = new Contract(
        process.env.VUE_APP_BRIDGE_CONTRACT,
        Abi.deposit,
        signer
      );

      const tx = await contract.deposit(
        state.balance.toString(),
        to
      );

      await dispatch('unsubscribe');
      await dispatch('addPendingTransaction', {
        id: state.pendingTransactions.length,
        hash: tx.hash,
        status: 'PENDING',
        time: Date.now(),
        to: process.env.VUE_APP_BRIDGE_CONTRACT,
        amount: toErc20btsg(amount.toString()),
        sender: state.address,
        type: TransactionType.DEPOSIT
      });
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Deposit failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    } finally {
      commit('setDepositLoading', false);
    }
  },
  addPendingTransaction({ commit, dispatch }, payload: Transaction) {
    commit('addPendingTransaction', payload);

    dispatch('subscribe').catch(error => console.error(error));
  },
  addBridgeTransactions({ commit, dispatch }, payload: Transaction[]) {
    commit('addBridgeTransactions', payload);

    dispatch('subscribeBridge').catch(error => console.error(error));
  },
  subscribe({ state, commit, dispatch }) {
    subscription = setInterval(async () => {
      const pendingTxs = state.pendingTransactions.filter(({ status }) => status === TransactionStatus.PENDING);

      if (pendingTxs.length > 0) {
        const provider = new providers.Web3Provider(window.ethereum as providers.ExternalProvider);

        for (const tx of pendingTxs) {
          const response = await provider.getTransactionReceipt(tx.hash);

          if (response !== null) {
            const transaction = state.pendingTransactions.find(({ hash }) => hash === response.transactionHash);

            if (transaction) {
              if (response.status === 1) {
                commit('editPendingTransaction', {
                  ...transaction,
                  status: 'SUCCESS'
                });

                await dispatch('unsubscribeBridge');
                dispatch('subscribeBridge').catch(error => { throw error; });
              } else {
                commit('editPendingTransaction', {
                  ...transaction,
                  status: 'FAILED'
                });
              }
            }

            dispatch('getBalance').catch(error => console.error(error));
          }
        }
      } else {
        dispatch('unsubscribe').catch(error => console.error(error));
      }
    }, parseInt(process.env.VUE_APP_BRIDGE_REFRESH));
  },
  subscribeBridge({ dispatch, commit, getters, state }) {
    subscriptionBridge = setInterval(async () => {
      const txsRelated = getters['pendingTransactions'] as TransactionWithRelated[];
      const pendingTxs = txsRelated.filter(el => el.status === TransactionStatus.PENDING && el.type === TransactionType.DEPOSIT);

      if (pendingTxs.length > 0) {
        for (const tx of pendingTxs) {
          const response = await getCassiniTxs(tx.sender);
          const { data } = response.data;

          if (Array.isArray(data)) {
            const txs: Transaction[] = data.map((el, index) => ({
              id: Date.now() + index,
              hash: el.hash,
              cosmosHash: el.status === CassiniTxStatus.Completed ? el.cosmos_hash : undefined,
              status: cassiniStatusConverter(el.status),
              amount: toErc20btsg(el.amount),
              time: new Date(el.created_at).getTime(),
              to: el.to,
              sender: el.from,
              type: TransactionType.COSMOS,
              meta: el
            }));

            txs.forEach((tx) => {
              const oldTx = state.bridgeTransactions.find(otx => otx.hash === tx.hash);

              if ((!oldTx || (oldTx && oldTx.status !== tx.status)) && tx.status === TransactionStatus.SUCCESS) {
                Dialog.create({
                  component: MessageDialog,
                  componentProps: {
                    title: 'success.title',
                    subtitle: 'success.cassiniTitle',
                    success: true
                  },
                });
              }
            });

            commit('addBridgeTransactions', txs);
          }
        }
      } else {
        dispatch('unsubscribeBridge').catch(error => console.error(error));
      }
    }, parseInt(process.env.VUE_APP_BRIDGE_REFRESH));
  },
  unsubscribeBridge() {
    clearInterval(subscriptionBridge);
  },
  unsubscribe() {
    clearInterval(subscription);
  }
}

export default actions;
