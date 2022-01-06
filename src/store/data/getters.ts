import { BigNumber } from 'bignumber.js';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';
import { bigFigureOrShortDecimals } from 'src/common/numbers';
import { Dictionary, keyBy, reduce, reverse, sortBy, take } from 'lodash';
import { Validator, ValidatorMap, Reward, ValidatorStatus } from 'src/models';

const getters: GetterTree<DataStateInterface, StateInterface> = {
  totalRewardsPerDenom({ rewards }) {
    return reduce<Reward, Dictionary<number>>(rewards, (all, reward) => {
      const amount = new BigNumber(reward.amount);
      const rewardDenom = new BigNumber(all[reward.denom] || 0);

      return {
        ...all,
        [reward.denom]: amount.plus(rewardDenom).toNumber()
      };
    }, {});
  },
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
  },
  validatorsOfDelegations({ delegations }) {
    return delegations.map(el => ({
      ...el.validator,
      delegation: el,
    }));
  },
  validatorsOfUndelegations({ undelegations }) {
    return undelegations.map(el => ({
      ...el.validator,
      undelegation: el,
    }));
  },
  activeValidators({ validators }) {
    return validators.filter(el => el.status === ValidatorStatus.ACTIVE);
  }
}

export default getters
