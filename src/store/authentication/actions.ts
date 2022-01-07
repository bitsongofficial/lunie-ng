import { ActionTree } from 'vuex';
import { NetworkConfig, Session, SessionType } from 'src/models';
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
  async changeNetwork({ commit, dispatch, state, rootState }, network: NetworkConfig) {
    try {
      commit('setNetwork', network);
      api.defaults.baseURL = network.apiURL;

      if (state.session && state.session.sessionType === SessionType.KEPLR) {
        await dispatch('keplr/init', 0, { root: true });
        await dispatch('signIn', {
          sessionType: SessionType.KEPLR,
          address: rootState.keplr.accounts[0].address,
        });
      } else {
        await dispatch('signIn', state.session);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}

export default actions;
