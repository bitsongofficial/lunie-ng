import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { KeplrStateInterface } from './state';
import mutations from './mutations';
import actions from './actions';

const keplrModule: Module<KeplrStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  mutations,
  state
}

export default keplrModule;
