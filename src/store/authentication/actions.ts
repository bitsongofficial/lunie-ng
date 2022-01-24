import { ActionTree } from 'vuex';
import { NetworkConfig, Session, SessionType } from 'src/models';
import { StateInterface } from '../index';
import { AuthenticationStateInterface } from './state';
import { api } from 'src/boot/axios';

const actions: ActionTree<AuthenticationStateInterface, StateInterface> = {
  resetLoadingData({ commit }) {
    commit('resetLoadingData');
  },
  async signIn({ commit, dispatch }, session: Session) {
    try {
      commit('setLoading', true);
      await dispatch('data/resetSessionData', undefined, { root: true });

      commit('setSession', session);
    } catch (error) {
      await dispatch('data/resetSessionData', undefined, { root: true });
      console.error('Err:', error);
      throw error;
    } finally {
      commit('setLoading', false);
      commit('setChanging', false);
    }
  },
  async signInRefresh({ commit, dispatch }, session: Session) {
    try {
      commit('setLoading', true);
      await dispatch('data/resetSessionData', undefined, { root: true });

      commit('setSession', session);

      if (session) {
        await dispatch('data/refresh', undefined, { root: true });
      }
    } catch (error) {
      await dispatch('data/resetSessionData', undefined, { root: true });
      console.error('Err:', error);
      throw error;
    } finally {
      commit('setLoading', false);
      commit('setChanging', false);
    }
  },
  async changeNetwork({ commit, dispatch }, { network, refresh }: { network: NetworkConfig, refresh: boolean }) {
    try {
      commit('setChanging', true);
      commit('setNetwork', network);
      api.defaults.baseURL = network.apiURL;

      if (refresh) {
        await dispatch('init');
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      commit('setChanging', false);
    }
  },
  async init({ dispatch, commit, state, rootState }) {
    try {
      await dispatch('data/resetSessionData', undefined, { root: true });

      if (state.session && state.session.sessionType === SessionType.KEPLR) {
        await dispatch('keplr/init', 0, { root: true });
        await dispatch('signInRefresh', {
          sessionType: SessionType.KEPLR,
          address: rootState.keplr.accounts[0].address,
        });
      } else if (state.session) {
        await dispatch('signInRefresh', state.session);
      }
    } catch (error) {
      console.error(error);
      await dispatch('data/resetSessionData', undefined, { root: true });
      commit('setSession', undefined);
      throw error;
    }
  },
}

export default actions;
