import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';

const getters: GetterTree<DataStateInterface, StateInterface> = {
  /* totalRewardsPerDenom ({ rewards }) {
    return rewards.reduce((all, reward) => {
      return {
        ...all,
        [reward.denom]: parseFloat(reward.amount) + (all[reward.denom] || 0),
      }
    }, {})
  } */
  currentBalance({ balances }) {
    return [...balances].pop();
  }
}

export default getters
