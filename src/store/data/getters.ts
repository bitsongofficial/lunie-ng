import { BigNumber } from 'bignumber.js';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';
import { shortDecimals, percent, splitDecimals, fiatConverter } from 'src/common/numbers';
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
    const maincoins = balances.filter(el => !el.id.includes('ibc'));

    return sortBy(maincoins, (balance) => balance.denom === authentication.network.stakingDenom ? 0 : 1).map(
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
          total: shortDecimals(total),
          available: shortDecimals(available),
        });
      }
    );
  },
  ibcBalances({ balances }) {
    const ibc = balances.filter(el => {
      const available = getStakingCoinViewAmount(new BigNumber(el.available).toString());

      return el.id.includes('ibc') && new BigNumber(available).gt(1e-4);
    });

    return sortBy(ibc, 'symbol').map(
      balance => {
        const total = getStakingCoinViewAmount(new BigNumber(balance.total).toString());
        const available = getStakingCoinViewAmount(new BigNumber(balance.available).toString());

        return ({
          ...balance,
          total: shortDecimals(total),
          available: shortDecimals(available),
        });
      }
    );
  },
  totalDelegated(_, { validatorsOfDelegations }) {
    const validators = validatorsOfDelegations as Validator[];
    const totalAmount = reduce(validators, (prev: BigNumber, curr: Validator) => {
      const currAmount = new BigNumber(curr.delegation?.amount ?? 0);

      return prev.plus(currAmount);
    }, new BigNumber(0));

    return shortDecimals(totalAmount.toFixed());
  },
  fiatDelegated(_, { validatorsOfDelegations, getCurrentPrice }) {
    const validators = validatorsOfDelegations as Validator[];
    const price = getCurrentPrice as number;
    const totalAmount = reduce(validators, (prev: BigNumber, curr: Validator) => {
      const currAmount = new BigNumber(curr.delegation?.amount ?? 0);

      return prev.plus(currAmount);
    }, new BigNumber(0));

    return fiatConverter(price, totalAmount);
  },
  currentBalance({ balances }, { getCurrentPrice }, { authentication }) {
    const balance = [...balances].find(bal => bal.denom === authentication.network.stakingDenom);
    const price = getCurrentPrice as number;
    const totalFiat = fiatConverter(price, balance?.total ?? '0');
    const availableFiat = fiatConverter(price, balance?.available ?? '0');

    if (balance) {
      return {
        ...balance,
        total: shortDecimals(new BigNumber(balance.total).toString()),
        available: shortDecimals(new BigNumber(balance.available).toString()),
        totalFiat,
        availableFiat
      }
    }
  },
  currentRawBalance({ balances }, _getters, { authentication }) {
    const balance = [...balances].find(bal => bal.denom === authentication.network.stakingDenom);

    return balance;
  },
  minDeposit({ depositParams }) {
    if (depositParams) {
      const deposit = [...depositParams.min_deposit].pop();
      const amount = getStakingCoinViewAmount(deposit ? deposit.amount : '0');
      const total = new BigNumber(amount);

      return total.toString();
    }

    return '0';
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
  marketCapFullyDiluited({ supplyInfo }, getters) {
    if (supplyInfo) {
      const price = getters['getCurrentPrice'] as number;
      const total = new BigNumber(supplyInfo.totalSupply).multipliedBy(price);
      const short = shortDecimals(total);

      if (short) {
        return splitDecimals(short);
      }
    }

    return null;
  },
  getAprInfo({ apr }) {
    return apr ? percent(new BigNumber(apr).toFixed(4)) : null;
  },
  getBondedTokensPercentage({ pool, supplyInfo }) {
    if (pool) {
      const bondedTokensNumber = new BigNumber(getStakingCoinViewAmount(pool.bonded_tokens));

      if (supplyInfo) {
        const totalSupply = new BigNumber(supplyInfo.totalSupply);

        return percent(bondedTokensNumber.div(totalSupply).toFixed(4));
      }
    }

    return null;
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
  getCurrentPrice({ coinDetails }, _, { settings }) {
    if (coinDetails) {
      return coinDetails.market_data.current_price[settings.currency];
    }

    return 0;
  },
  getMarketCap({ coinDetails }, _, { settings }) {
    if (coinDetails) {
      return coinDetails.market_data.market_cap[settings.currency];
    }

    return 0;
  },
  getTotalVolume({ coinDetails }, _, { settings }) {
    if (coinDetails) {
      return coinDetails.market_data.total_volume[settings.currency];
    }

    return 0;
  },
}

export default getters
