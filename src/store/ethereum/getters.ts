import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { EthereumStateInterface } from './state';

const getters: GetterTree<EthereumStateInterface, StateInterface> = {
  mustApprove(state) {
    return state.mustApprove;
  },
  approveLoading(state) {
    return state.approveLoading;
  },
  depositLoading(state) {
    return state.depositLoading;
  },
  pendingTransactions(state) {
    return state.pendingTransactions;
  },
  address(state) {
    return state.address;
  },
  balance(state) {
    return state.balance;
  },
};

export default getters;
