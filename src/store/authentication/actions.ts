import { ActionTree } from 'vuex';
import { Session } from 'src/models';
import { StateInterface } from '../index';
import { AuthenticationStateInterface } from './state';

const actions: ActionTree<AuthenticationStateInterface, StateInterface> = {
  async signIn({ commit, dispatch }, session: Session) {
    try {
      await dispatch('data/resetSessionData', undefined, { root: true });

      commit('setSession', session)
      await dispatch('data/refresh', undefined, { root: true });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}

export default actions;
