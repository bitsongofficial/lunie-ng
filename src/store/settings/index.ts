import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { SettingsStateInterface } from './state';
import mutations from './mutations';

const notificationsModule: Module<SettingsStateInterface, StateInterface> = {
  namespaced: true,
  mutations,
  state
}

export default notificationsModule;
