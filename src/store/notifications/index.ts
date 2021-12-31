import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { NotificationsStateInterface } from './state';
import mutations from './mutations';

const notificationsModule: Module<NotificationsStateInterface, StateInterface> = {
  namespaced: true,
  mutations,
  state
}

export default notificationsModule;
