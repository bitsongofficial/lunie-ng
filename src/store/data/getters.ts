import { BigNumber } from 'bignumber.js';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';
import { bigFigureOrShortDecimals, percent } from 'src/common/numbers';
import { Dictionary, keyBy, reduce, reverse, sortBy, take } from 'lodash';
import { Validator, ValidatorMap, Reward, ValidatorStatus, ProposalStatus } from 'src/models';
import { getStakingCoinViewAmount } from 'src/common/cosmos-reducer';

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
  totalRewardsPerDenomByValidator() {
    return (rewards: Reward[]) => {
      return reduce<Reward, Dictionary<number>>(rewards, (all, reward) => {
        const amount = new BigNumber(reward.amount);
        const rewardDenom = new BigNumber(all[reward.denom] || 0);

        return {
          ...all,
          [reward.denom]: amount.plus(rewardDenom).toNumber()
        };
      }, {});
    };
  },
  balances({ balances }, _getters, { authentication }) {
    return sortBy(balances, (balance) => balance.denom === authentication.network.stakingDenom ? 0 : 1).map(
      balance => {
        if (balance.denom === authentication.network.stakingDenom) {
          return ({
            ...balance,
          });
        }

        const total = getStakingCoinViewAmount(new BigNumber(balance.total).toString());
        const available = getStakingCoinViewAmount(new BigNumber(balance.available).toString());

        return ({
          ...balance,
          total: bigFigureOrShortDecimals(total),
          available: bigFigureOrShortDecimals(available),
        });
      }
    );
  },
  currentBalance({ balances }, _getters, { authentication }) {
    const balance = [...balances].find(bal => bal.denom === authentication.network.stakingDenom);

    if (balance) {
      return {
        ...balance,
        total: bigFigureOrShortDecimals(new BigNumber(balance.total).toString()),
        available: bigFigureOrShortDecimals(new BigNumber(balance.available).toString()),
      }
    }
  },
  currentRawBalance({ balances }, _getters, { authentication }) {
    const balance = [...balances].find(bal => bal.denom === authentication.network.stakingDenom);

    return balance;
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
  },
  votingProposalsCount({ proposals }, _getters, { authentication }) {
    return proposals.filter(el => {
      if (el.status === ProposalStatus.VOTING) {

        if (el.detailedVotes && authentication.session) {
          const vote = el.detailedVotes.votes.find(detailVote => detailVote.voter.address === authentication.session?.address);

          return vote === undefined;
        }

        return true;
      }

      return false;
    }).length;
  },
  proposalVoted({ proposals }, _getters, { authentication }) {
    return (id: number) => {
      const proposal = proposals.find(el => el.id === id);

      if (proposal && proposal.detailedVotes && authentication.session) {
        const vote = proposal.detailedVotes.votes.find(detailVote => detailVote.voter.address === authentication.session?.address);

        return vote !== undefined;
      }

      return false;
    };
  },
  getTotalSupply({ supply }) {
    if (supply) {
      const amount = getStakingCoinViewAmount(supply ? supply.amount : '0');
      const total = new BigNumber(amount);

      return total.toString();
    }

    return null;
  },
  getCommunityPool({ communityPool }) {
    if (communityPool.length > 0) {
      let total = new BigNumber('0');

      communityPool.forEach(coin => {
        const amount = getStakingCoinViewAmount(coin ? coin.amount : '0');
        total = total.plus(new BigNumber(amount));
      });

      return total.toString();
    }

    return null;
  },
  supplyInfo({ supplyInfo }, getters, { authentication }) {
    if (supplyInfo) {
      return {
        ...supplyInfo,
        circulatingSupply: `${bigFigureOrShortDecimals(new BigNumber(supplyInfo.circulatingSupply).toString()) ?? ''} ${supplyInfo.denom}`,
        communityPool: `${bigFigureOrShortDecimals(new BigNumber(supplyInfo.communityPool).toString()) ?? ''} ${supplyInfo.denom}`,
        totalSupply: `${bigFigureOrShortDecimals(new BigNumber(supplyInfo.totalSupply).toString()) ?? ''} ${supplyInfo.denom}`
      };
    } else {
      const totalSupply = getters['getTotalSupply'] as string | null;
      const communityPool = getters['getCommunityPool'] as string | null;

      return {
        totalSupply: totalSupply ? `${bigFigureOrShortDecimals(totalSupply) ?? ''} ${authentication.network.stakingDenom}` : null,
        communityPool: communityPool ? `${bigFigureOrShortDecimals(communityPool) ?? ''} ${authentication.network.stakingDenom}` : null,
      }
    }
  },
  getAprInfo({ apr }) {
    return apr ? percent(new BigNumber(apr).toFixed(4)) : null;
  },
  getInflation({ inflation }) {
    if (inflation) {
      return percent(new BigNumber(inflation).toFixed(4));
    }

    return null;
  },
  getBondedTokens({ pool }, _getters, { authentication }) {
    if (pool) {
      const bondedTokensNumber = new BigNumber(getStakingCoinViewAmount(pool.bonded_tokens));
      return `${bigFigureOrShortDecimals(bondedTokensNumber.toString()) ?? ''} ${authentication.network.stakingDenom}`;
    }

    return null;
  },
}

export default getters
