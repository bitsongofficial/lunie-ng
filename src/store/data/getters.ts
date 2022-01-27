import { BigNumber } from 'bignumber.js';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';
import { shortDecimals, percent, splitDecimals } from 'src/common/numbers';
import { mapBalance } from 'src/common/balance';
import { compact, Dictionary, keyBy, reduce, reverse, sortBy, take } from 'lodash';
import { Validator, ValidatorMap, Reward, ValidatorStatus, ProposalStatus, Balance } from 'src/models';
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
    return sortBy(balances, (balance) => balance.denom === authentication.network.stakingDenom ? 0 : 1)
      .filter(balance => balance.denom.includes(authentication.network.stakingDenom))
      .map(balance => mapBalance(balance, authentication.network.stakingDenom));
  },
  fantokenBalances({ balances }, _getters, { fantoken, authentication }): Balance[] {
    const fantokens = [...fantoken.fantokens];
    const stakingDenom = authentication.network.stakingDenom;
    const balancesMap = balances.map(balance => {
      const fantoken = fantokens.find(el => el.metaData?.base === balance.denom);

      if (fantoken) {
        return {
          ...mapBalance(balance, stakingDenom),
          name: fantoken.name,
          display: fantoken.metaData?.display as string
        };
      }
    });

    return sortBy(compact(balancesMap), 'display');
  },
  currentBalance({ balances }, _getters, { authentication }) {
    const balance = [...balances].find(bal => bal.denom === authentication.network.stakingDenom);

    if (balance) {
      return {
        ...balance,
        total: shortDecimals(new BigNumber(balance.total).toString()),
        available: shortDecimals(new BigNumber(balance.available).toString()),
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
  supplyInfo({ supplyInfo }, getters) {
    if (supplyInfo) {
      return {
        ...supplyInfo,
        circulatingSupply: splitDecimals(shortDecimals(new BigNumber(supplyInfo.circulatingSupply).toString()) ?? ''),
        communityPool: splitDecimals(shortDecimals(new BigNumber(supplyInfo.communityPool).toString()) ?? ''),
        totalSupply: splitDecimals(shortDecimals(new BigNumber(supplyInfo.totalSupply).toString()) ?? '')
      };
    } else {
      const totalSupply = getters['getTotalSupply'] as string | null;
      const communityPool = getters['getCommunityPool'] as string | null;

      return {
        totalSupply: totalSupply ? splitDecimals(shortDecimals(totalSupply) ?? '') : null,
        communityPool: communityPool ? splitDecimals(shortDecimals(communityPool) ?? '') : null,
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
  getBondedTokens({ pool }) {
    if (pool) {
      const bondedTokensNumber = new BigNumber(getStakingCoinViewAmount(pool.bonded_tokens));
      return splitDecimals(shortDecimals(bondedTokensNumber.toString()) ?? '');
    }

    return null;
  },
}

export default getters
