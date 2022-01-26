import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { FantokenStateInterface } from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

const fantokenModule: Module<FantokenStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default fantokenModule;
