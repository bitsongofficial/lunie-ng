import { FanTokenWithStats } from 'src/models';
import { initBitsong, bitsong, getFantokensParams, getSupplyByDenom, getBurnedTokens } from 'src/services';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { FantokenStateInterface } from './state';

const actions: ActionTree<FantokenStateInterface, StateInterface> = {
  async getFantokens({ commit }) {
    try {
      commit('setLoading', true);
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
    } finally {
      commit('setLoading', false);
    }
  },
  async init({ dispatch, commit }) {
    try {
      await initBitsong();

      const params = await getFantokensParams();
      commit('setParams', params.params);

      await dispatch('refresh');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  async refresh({ dispatch }) {
    try {
      await dispatch('getFantokens');
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
}

export default actions;
