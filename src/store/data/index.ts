import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { DataStateInterface } from './state';
import mutations from './mutations';
import actions from './actions';

const dataModule: Module<DataStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  mutations,
  state
}

export default dataModule;
