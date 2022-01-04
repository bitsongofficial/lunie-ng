import { BlockResponse } from '@cosmjs/launchpad';
import { Coin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';
import { network } from 'src/constants';
import {
  BlockReduced,
  DelegationWithBalance,
  NetworkConfigFeeOption,
  PoolResponse,
  ValidatorRaw,
  ValidatorStatus,
  Validator,
  Delegation,
  IBCInfo,
  RewardWithAddress,
  BalanceCoin,
  UnbondingDelegationFlat,
  UnbondingDelegation,
  Balance
} from 'src/models';
import { getCoinLookup } from './network';
import { flattenDeep } from 'lodash';

export function coinReducer(chainCoin: NetworkConfigFeeOption, ibcInfo: Partial<IBCInfo> | undefined = undefined): BalanceCoin {
  const chainDenom = ibcInfo && ibcInfo.denom ? ibcInfo.denom : chainCoin.denom;
  const coinLookup = getCoinLookup(chainDenom);
  const sourceChain = (ibcInfo && ibcInfo.chainTrace) ? ibcInfo.chainTrace[0] : undefined

  if (!coinLookup) {
    return {
      supported: false,
      amount: chainCoin.amount,
      denom: chainDenom,
      sourceChain
    }
  }

  const precision = coinLookup.chainToViewConversionFactor
    .toString()
    .split('.')[1].length;

  return {
    supported: true,
    amount: new BigNumber(chainCoin.amount)
      .times(coinLookup.chainToViewConversionFactor)
      .toFixed(precision),
    denom: coinLookup.viewDenom,
    sourceChain
  };
}

export const blockReducer = (block: BlockResponse): BlockReduced => {
  return {
    id: block.block_id.hash,
    height: block.block.header.height,
    chainId: block.block.header.chain_id,
    hash: block.block_id.hash,
    time: block.block.header.time,
    proposer_address: block.block.header.proposer_address,
  };
}

export function undelegationReducer(undelegation: UnbondingDelegationFlat, validator: Validator): UnbondingDelegation {
  return {
    id: `${validator.operatorAddress}_${undelegation.creation_height}`,
    delegatorAddress: undelegation.delegator_address,
    validator,
    amount: getStakingCoinViewAmount(undelegation.balance),
    startHeight: undelegation.creation_height,
    endTime: undelegation.completion_time,
  }
}

export function balanceReducer(lunieCoin: BalanceCoin, delegations: Delegation[], undelegations: UnbondingDelegation[]): Balance {
  const isStakingDenom = lunieCoin.denom === network.stakingDenom;

  const delegatedStake = delegations.reduce(
    (sum, { amount }) => {
      return new BigNumber(sum).plus(new BigNumber(amount));
    },
    new BigNumber(0)
  );

  const undelegatingStake = undelegations.reduce(
    (sum, { amount }) => {
      return new BigNumber(sum).plus(new BigNumber(amount));
    },
    new BigNumber(0)
  );

  const total = isStakingDenom
    ? new BigNumber(lunieCoin.amount).plus(delegatedStake).plus(undelegatingStake)
    : lunieCoin.amount;

  return {
    id: lunieCoin.denom,
    type: isStakingDenom ? 'STAKE' : 'CURRENCY',
    total,
    denom: lunieCoin.denom,
    available: lunieCoin.amount,
    staked: 0,
    sourceChain: lunieCoin.sourceChain,
  };
}

export const delegationReducer = (delegation: DelegationWithBalance, validator: Validator, active: ValidatorStatus): Delegation | undefined => {
  const coinLookup = getCoinLookup(network.stakingDenom, delegation.balance.denom);

  if (coinLookup) {
    const { amount, denom } = coinReducer(delegation.balance);

    return {
      id: delegation.delegation.validator_address.concat(`-${denom}`),
      validatorAddress: delegation.delegation.validator_address,
      delegatorAddress: delegation.delegation.delegator_address,
      validator,
      amount,
      active,
    }
  }
}

export const getValidatorStatus = (validator: ValidatorRaw) => {
  if (validator.status.toString() === '3') {
    return {
      status: ValidatorStatus.ACTIVE,
      status_detailed: 'active',
    }
  }
  if (
    validator.signing_info &&
    new Date(validator.signing_info.jailed_until) > new Date(9000, 1, 1)
  ) {
    return {
      status: ValidatorStatus.INACTIVE,
      status_detailed: 'banned',
    }
  }

  return {
    status: ValidatorStatus.INACTIVE,
    status_detailed: 'inactive',
  }
}

export const getStakingCoinViewAmount = (chainStakeAmount: string) => {
  const coinLookup = getCoinLookup(network.stakingDenom, 'viewDenom')

  if (coinLookup) {
    return coinReducer({
      amount: chainStakeAmount,
      denom: coinLookup.chainDenom,
    }).amount
  }

  return '0';
}

export const validatorReducer = (validator: ValidatorRaw, annualProvision: string | number, totalShares: number, pool: PoolResponse): Validator => {
  const statusInfo = getValidatorStatus(validator)
  let websiteURL = validator.description.website
  if (!websiteURL || websiteURL === '[do-not-modify]') {
    websiteURL = ''
  } else if (RegExp(/http[s]?/).exec(websiteURL)?.length === 0) {
    websiteURL = 'https://' + websiteURL
  }

  const pctCommission = new BigNumber(1 - parseFloat(validator.commission.commission_rates.rate));
  const provision = new BigNumber(annualProvision);
  const bonded = new BigNumber(pool.pool.bonded_tokens);
  const expectedRewards = pctCommission.times(provision.div(bonded));

  return {
    id: validator.operator_address,
    operatorAddress: validator.operator_address,
    consensusPubkey: validator.consensus_pubkey,
    jailed: validator.jailed,
    details: validator.description.details,
    website: websiteURL,
    identity: validator.description.identity,
    name: validator.description.moniker,
    votingPower: validator.status.toString() === '3' ? (parseFloat(validator.delegator_shares) / totalShares).toFixed(6) : 0,
    startHeight: validator.signing_info
      ? validator.signing_info.start_height
      : undefined,
    uptimePercentage: 1,
    tokens: getStakingCoinViewAmount(validator.tokens),
    commissionUpdateTime: validator.commission.update_time,
    commission: Number(validator.commission.commission_rates.rate).toFixed(6),
    maxCommission: validator.commission.commission_rates.max_rate,
    maxChangeCommission: validator.commission.commission_rates.max_change_rate,
    status: statusInfo.status,
    statusDetailed: statusInfo.status_detailed,
    expectedReturns: annualProvision ? expectedRewards : undefined,
  }
}

export const reduceFormattedRewards = (reward: Coin[], validator: Validator) => {
  return reward.map((denomReward) => {
    const lunieCoin = coinReducer(denomReward);

    if (Number(lunieCoin.amount) < 0.000001) {
      return null;
    }

    return {
      id: `${validator.operatorAddress}_${lunieCoin.denom}`,
      denom: lunieCoin.denom,
      amount: lunieCoin.amount,
      validator,
    }
  });
}

export const rewardReducer = (rewards: RewardWithAddress[], validatorsDictionary: { [key: string]: Validator }) => {
  const formattedRewards = rewards.map((reward) => ({
    reward: reward.reward,
    validator: validatorsDictionary[reward.validator_address],
  }));

  const multiDenomRewardsArray = formattedRewards.map(({ reward, validator }) => reduceFormattedRewards(reward, validator));

  return flattenDeep(multiDenomRewardsArray).filter((reward) => reward);
}
