import { BlockResponse } from '@cosmjs/launchpad';
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
  Delegation
} from 'src/models';
import { getCoinLookup } from './network';

export function coinReducer(chainCoin: NetworkConfigFeeOption, ibcInfo: NetworkConfigFeeOption | undefined = undefined) {
  const chainDenom = ibcInfo ? ibcInfo.denom : chainCoin.denom;
  const coinLookup = getCoinLookup(chainDenom);

  if (!coinLookup) {
    return {
      supported: false,
      amount: chainCoin.amount,
      denom: chainDenom,
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

export const delegationReducer = (delegation: DelegationWithBalance, validator: Validator, active: ValidatorStatus): Delegation | undefined => {
  const coinLookup = getCoinLookup(network.stakingDenom, delegation.balance.denom);
  console.log(coinLookup);

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
