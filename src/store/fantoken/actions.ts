import { FanTokenWithStats } from 'src/models';
import { initBitsong, bitsong, getFantokensParams, getSupplyByDenom, getBurnedTokens } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { FantokenStateInterface } from './state';

const actions: ActionTree<FantokenStateInterface, StateInterface> = {
  async getFantokens({ commit }) {
    try {
      // Query owner empty to get all coins
      const fantokensRaw = await bitsong.getAllFanTokensByOwner('');
      const burnedCoins = await getBurnedTokens();
      const fantokens: FanTokenWithStats[] = [];

      for (const fantoken of fantokensRaw) {
        const supplyTotal = await getSupplyByDenom(fantoken.metaData?.base ?? '');
        const burnedCoin = burnedCoins.find(el => el.denom === fantoken.metaData?.base);

        fantokens.push({
          ...fantoken,
          supply: supplyTotal,
          burned: burnedCoin
        });
      }

      commit('setFantokens', fantokens);
    } catch (error) {
      console.error(error);
    }
  },
  async init({ dispatch, commit }) {
    try {
      commit('setLoading', true);
      await initBitsong();

      const params = await getFantokensParams();
      commit('setParams', params.params);

      await dispatch('refresh');
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
  async refresh({ dispatch, commit }) {
    try {
      commit('setLoading', true);
      await dispatch('getFantokens');
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },
}

export default actions;
