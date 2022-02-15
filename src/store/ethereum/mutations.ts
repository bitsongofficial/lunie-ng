import { BigNumber } from 'bignumber.js';
import { uniqBy } from 'lodash';
import { Transaction } from 'src/models';
import { MutationTree } from 'vuex'
import { EthereumStateInterface } from './state'

const mutation: MutationTree<EthereumStateInterface> = {
  setLoadingMetamask(state, loadingMetamask: boolean) {
    state.loadingMetamask = loadingMetamask;
  },
  setApproveLoading(state, approveLoading: boolean) {
    state.approveLoading = approveLoading;
  },
  setDepositLoading(state, depositLoading: boolean) {
    state.depositLoading = depositLoading;
  },
  setAddress(state, address: string) {
    state.address = address;
  },
  setBalance(state, balance: BigNumber) {
    state.balance = balance;
  },
  setChainId(state, chainId: string) {
    state.chainId = chainId;
  },
  setApprove(state, mustApprove: boolean) {
    state.mustApprove = mustApprove;
  },
  setLoadingAllowance(state, loadingAllowance: boolean) {
    state.loadingAllowance = loadingAllowance;
  },
  addPendingTransaction(state, transaction: Transaction) {
    state.pendingTransactions = [...state.pendingTransactions, transaction];
  },
  addBridgeTransactions(state, transactions: Transaction[]) {
    const bridgeTransactions = uniqBy([...transactions, ...state.bridgeTransactions], 'hash');

    state.bridgeTransactions = [...bridgeTransactions];
  },
  editPendingTransaction(state, transaction: Transaction) {
    const pendingTransactions = [...state.pendingTransactions];

    state.pendingTransactions = pendingTransactions.map((el) => {
      if (el.hash === transaction.hash) {
        return transaction;
      }

      return el;
    });
  },
}

export default mutation;
