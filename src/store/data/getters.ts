import { BigNumber } from 'bignumber.js';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';
import { bigFigureOrShortDecimals } from 'src/common/numbers';
import { keyBy, reverse, sortBy, take } from 'lodash';
import { Validator, ValidatorMap } from 'src/models';

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
    const balance = [...balances].pop();

    if (balance) {
      return {
        ...balance,
        total: bigFigureOrShortDecimals(new BigNumber(balance.total).toString()),
        available: bigFigureOrShortDecimals(new BigNumber(balance.available).toString()),
      }
    }
  },
  validatorsDictionary({ validators }): ValidatorMap {
    return keyBy(validators, 'operatorAddress');
  },
  topVoters({ validators }): Validator[] {
    return take(
      reverse(
        sortBy(validators, [
          (validator) => {
            return validator.votingPower
          },
        ])
      ),
      10
    );
  }
}

export default getters
