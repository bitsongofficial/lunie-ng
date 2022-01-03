import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { AuthenticationStateInterface } from './state';
import mutations from './mutations';
import actions from './actions';

const authenticationModule: Module<AuthenticationStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  mutations,
  state
}

export default authenticationModule;
