import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { TransferStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const transferModule: Module<TransferStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
};

export default transferModule;
