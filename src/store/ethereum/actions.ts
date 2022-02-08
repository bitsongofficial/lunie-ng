/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import detectEthereumProvider from '@metamask/detect-provider';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { providers, utils, Contract } from 'ethers';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { EthereumStateInterface } from './state';

import * as Abi from 'src/constants/abi';

let provider: providers.Web3Provider;
let subscription: NodeJS.Timeout;

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
      }
    } catch (err) {
      console.error(err);
      commit('setAddress', null);

      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Connection to metamask failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    } finally {
      commit('setLoadingMetamask', false)
    }
  },
  async getBalance({ state, commit, dispatch }) {
    try {
      const contract = new Contract(
        process.env.VUE_APP_BTSG_CONTRACT,
        Abi.balanceOf,
        provider
      );

      const balance = await contract.balanceOf(state.address);

      commit('setBalance', balance);

      dispatch('getAllowance').catch(error => console.error(error));
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
        hash: tx.hash,
        status: 'PENDING',
        time: Date.now(),
        to: process.env.VUE_APP_BTSG_CONTRACT
      });
    } catch (err) {
      commit('setApproveLoading', false)
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
    }
  },
  async deposit({ commit, dispatch, state }, to: string) {
    try {
      commit('setDepositLoading', true)

      const signer = provider.getSigner();

      const contract = new Contract(
        process.env.VUE_APP_BRIDGE_CONTRACT,
        Abi.deposit,
        signer
      );

      const tx = await contract.deposit(
        state.balance.div(10).toString(),
        to
      );

      await dispatch('unsubscribe');
      await dispatch('addPendingTransaction', {
        hash: tx.hash,
        status: 'PENDING',
        time: Date.now(),
        to: process.env.VUE_APP_BRIDGE_CONTRACT
      });
    } catch (err) {
      commit('setDepositLoading', false);
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
    }
  },
  addPendingTransaction({ commit, dispatch }, payload) {
    commit('addPendingTransaction', payload);

    dispatch('subscribe').catch(error => console.error(error));
  },
  subscribe({ state, commit, dispatch }) {
    subscription = setInterval(async () => {
      const pendingTxs = state.pendingTransactions;

      if (pendingTxs.length > 0) {
        const provider = new providers.Web3Provider(window.ethereum as providers.ExternalProvider);

        for (const tx of pendingTxs) {
          const response = await provider.getTransactionReceipt(tx.hash);

          // TODO: add check for status (0 error, 1 success)
          if (response !== null) {
            commit('removePendingTransaction', tx);
            dispatch('getBalance').catch(error => console.error(error));
          }
        }
      } else {
        dispatch('unsubscribe').catch(error => console.error(error));
      }
    }, 1500);
  },
  unsubscribe() {
    clearInterval(subscription);
  }
}

export default actions;
