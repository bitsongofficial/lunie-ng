import { getFantokens } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { FantokenStateInterface } from './state'

const actions: ActionTree<FantokenStateInterface, StateInterface> = {
  async getFantokens({ commit }) {
    try {
      commit('setLoading', true);
      const fantokens = await getFantokens();

      commit('setFantokens', fantokens);
    } catch (error) {
      console.error(error);
    } finally {
      commit('setLoading', false);
    }
  },
  async init({ dispatch }) {
    try {
      await dispatch('getFantokens');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}

export default actions;
