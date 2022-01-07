import { ActionTree } from 'vuex';
import { NetworkConfig, Session } from 'src/models';
import { StateInterface } from '../index';
import { AuthenticationStateInterface } from './state';
import { api } from 'src/boot/axios';

const actions: ActionTree<AuthenticationStateInterface, StateInterface> = {
  async signIn({ commit, dispatch }, session: Session) {
    try {
      await dispatch('data/resetSessionData', undefined, { root: true });

      commit('setSession', session);
      await dispatch('data/refresh', undefined, { root: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async changeNetwork({ commit, dispatch, state}, network: NetworkConfig) {
    try {
      commit('setNetwork', network);
      api.defaults.baseURL = network.apiURL;
      await dispatch('signIn', state.session);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}

export default actions;
