import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { EthereumStateInterface } from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

const ethereumModule: Module<EthereumStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default ethereumModule;
