import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { TransferStateInterface } from './state';
import actions from './actions';
import mutations from './mutations';

const transferModule: Module<TransferStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  mutations,
  state
};

export default transferModule;
