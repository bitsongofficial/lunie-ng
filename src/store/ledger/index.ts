import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { LedgerStateInterface } from './state';
import mutations from './mutations';
import actions from './actions';

const ledgerModule: Module<LedgerStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  mutations,
  state
}

export default ledgerModule;
