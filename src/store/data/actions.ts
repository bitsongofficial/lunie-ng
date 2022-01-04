import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';
import { getBalances, getBlock } from 'src/services';

const actions: ActionTree<DataStateInterface, StateInterface> = {
  resetSessionData({ commit }) {
    commit('resetSessionData');
  },
  async refresh({ dispatch, commit }) {
    try {
      /* await dispatch('getValidators'); */
      await dispatch('getBlock');
      await dispatch('refreshSession');
      /* await dispatch('getProposals');
      await dispatch('getGovernanceOverview'); */
    } catch (error) {
      console.error(error);

        if (error instanceof Error) {
          commit(
            'notifications/add',
            {
              type: 'danger',
              message: 'Refresh failed:' + error.message,
            },
            { root: true }
          );
        }

        throw error;
    }
  },
  async refreshSession({ dispatch, commit, rootState }) {
    const session = rootState.authentication.session;
    const currency = 'USD';

    if (session) {
      const address = session.address;

      try {
        await dispatch('getBalances', { address, currency });
        /* await dispatch('getRewards', { address, currency });
        await dispatch('getTransactions', { address });
        await dispatch('getDelegations', address);
        await dispatch('getUndelegations', address); */
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          commit(
            'notifications/add',
            {
              type: 'danger',
              message: 'Refresh session failed:' + error.message,
            },
            { root: true }
          );
        }

        throw error;
      }
    }
  },
  async getBlock ({ commit }) {
    try {
      const block = await getBlock();
      commit('setBlock', block);

      return block;
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting block failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    }
  },
  async getBalances({ commit }, { address, currency }) {
    try {
      const balances = await getBalances(address, currency);
      commit('setBalances', balances);
      commit('setBalancesLoaded', true);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting balances failed:' + err.message,
          },
          { root: true }
        );
      }

      commit('setBalancesLoaded', false);

      throw err;
    }
  },
}

export default actions;
