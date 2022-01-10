import { getLedger } from 'src/common/ledger'
import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { LedgerStateInterface } from './state'

const actions: ActionTree<LedgerStateInterface, StateInterface> = {
  async init({ commit, state }) {
    try {
      commit('authentication/setLoading', true, { root: true });
      commit('setLoading', true);
      commit('setError', undefined);

      const response = await getLedger(state.transport);

      if (response) {
        commit('setLedger', response.ledger);
        commit('setTransport', response.transport);

        const accounts = await response.ledger.getAccounts();

        commit('setAccounts', accounts);
      }
    } catch (err) {
      if (err instanceof Error) {
        commit('setError', err.message);
      }
    } finally {
      commit('setLoading', false);
      commit('authentication/setLoading', false, { root: true });
    }
  },
}

export default actions;
