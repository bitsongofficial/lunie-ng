import { encodeB32, decodeB32 } from './address';
import { BlockResponse } from '@cosmjs/launchpad';
import { Coin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';
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
  Balance,
  Deposit,
  ValidatorMap,
  Vote,
  ProposalRaw,
  DetailedVote,
  ProposalType,
  ProposalRawStatus,
  TopVoterValidator,
  ProposalStatus,
  TallyWithExtra,
  Proposal
} from 'src/models';
import { getCoinLookup } from './network';
import { flattenDeep } from 'lodash';
import { getProposalSummary } from './common-reducer';
import { Tally } from '@cosmjs/launchpad/build/lcdapi/gov';
import Store from 'src/store';
import { coinImages } from 'src/constants';

const proposalTypeEnumDictionary: { [key: string]: string } = {
  TextProposal: 'TEXT',
  CommunityPoolSpendProposal: 'TREASURY',
  ParameterChangeProposal: 'PARAMETER_CHANGE',
  SoftwareUpgradeProposal: 'SOFTWARE_UPGRADE',
};

export function coinReducer(chainCoin: NetworkConfigFeeOption | Coin, ibcInfo: Partial<IBCInfo> | undefined = undefined): BalanceCoin {
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

  const coinDecimals = new BigNumber(coinLookup.chainToViewConversionFactor).toFixed();
  const decimals = coinDecimals.split('.')

  const precision = decimals.length > 1 ? coinDecimals.split('.')[1].length : 0;

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

export function balanceReducer(lunieCoin: BalanceCoin, delegations: Delegation[], undelegations: UnbondingDelegation[], name: string, symbol?: string, icon?: string): Balance {
  const isStakingDenom = lunieCoin.denom === Store.state.authentication.network.stakingDenom;

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
    ? new BigNumber(lunieCoin.amount).plus(delegatedStake).plus(undelegatingStake).toString()
    : lunieCoin.amount;

  const coinSymbol = symbol ? symbol : lunieCoin.denom;
  let image = coinImages.find(img => img.symbol === coinSymbol)?.image;

  if (!image) {
    image = icon;
  }

  return {
    id: lunieCoin.denom,
    type: isStakingDenom ? 'STAKE' : 'CURRENCY',
    total,
    symbol: coinSymbol,
    denom: lunieCoin.denom,
    available: lunieCoin.amount,
    staked: 0,
    sourceChain: lunieCoin.sourceChain,
    image,
    name
  };
}

export const delegationReducer = (delegation: DelegationWithBalance, validator: Validator, active: ValidatorStatus): Delegation | undefined => {
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
  const coinLookup = getCoinLookup(Store.state.authentication.network.stakingDenom, 'viewDenom');

  if (coinLookup) {
    return coinReducer({
      amount: chainStakeAmount,
      denom: coinLookup.chainDenom,
    }).amount;
  }

  return '0';
}

export const validatorReducer = (validator: ValidatorRaw, annualProvision: string | number | undefined, totalShares: number | BigNumber, pool: PoolResponse): Validator => {
  const statusInfo = getValidatorStatus(validator)
  let websiteURL = validator.description.website
  if (!websiteURL || websiteURL === '[do-not-modify]') {
    websiteURL = ''
  } else if (RegExp(/http[s]?/).exec(websiteURL)?.length === 0) {
    websiteURL = 'https://' + websiteURL
  }

  const pctCommission = new BigNumber(1 - parseFloat(validator.commission.commission_rates.rate));
  const provision = new BigNumber(annualProvision ?? 0);
  const bonded = new BigNumber(pool.pool.bonded_tokens);
  const expectedRewards = pctCommission.times(provision.div(bonded));

  const delegatorShares = new BigNumber(validator.delegator_shares);
  const totalSharesBig = new BigNumber(totalShares);

  return {
    id: validator.operator_address,
    operatorAddress: validator.operator_address,
    consensusPubkey: validator.consensus_pubkey,
    jailed: validator.jailed,
    details: validator.description.details,
    website: websiteURL,
    identity: validator.description.identity,
    name: validator.description.moniker,
    votingPower: validator.status.toString() === '3' ? (delegatorShares.div(totalSharesBig)).toFixed(6) : 0,
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

export const rewardReducer = (rewards: RewardWithAddress[], validatorsDictionary: ValidatorMap) => {
  const formattedRewards = rewards.map((reward) => ({
    reward: reward.reward,
    validator: validatorsDictionary[reward.validator_address],
  }));

  const multiDenomRewardsArray = formattedRewards.map(({ reward, validator }) => reduceFormattedRewards(reward, validator));

  return flattenDeep(multiDenomRewardsArray).filter((reward) => reward);
}

const networkAccountReducer = (address: string, validators: ValidatorMap) => {
  const proposerValAddress = address ?
    encodeB32(decodeB32(address), Store.state.authentication.network.validatorAddressPrefix, 'hex')
    :
    '';

  const validator = validators && proposerValAddress.length > 0 ?
    validators[proposerValAddress]
    :
    undefined;

  return {
    name: validator ? validator.name : undefined,
    address: validator ? proposerValAddress : address || '',
    picture: validator ? validator.picture : '',
    validator,
  };
}

export const depositReducer = (deposit: Deposit, validators: ValidatorMap) => {
  return {
    id: deposit.depositor,
    amount: deposit.amount.map(el => coinReducer(el)),
    depositer: networkAccountReducer(deposit.depositor, validators)
  };
}

export function voteReducer(vote: Vote, validators: ValidatorMap) {
  return {
    id: String(vote.proposal_id.concat(`_${vote.voter}`)),
    voter: networkAccountReducer(vote.voter, validators),
    option: vote.option
  };
}

const proposalFinalized = (proposal: ProposalRaw) => {
  return [ProposalRawStatus.PROPOSAL_STATUS_PASSED, ProposalRawStatus.PROPOSAL_STATUS_REJECTED].includes(
    proposal.status
  );
}

function getTotalVotePercentage(proposal: ProposalRaw, totalBondedTokens: string, totalVoted: string | number | BigNumber) {
  // for passed proposals we can't calculate the total voted percentage, as we don't know the totalBondedTokens in the past
  if (proposalFinalized(proposal)) {
    return -1;
  }

  if (new BigNumber(totalVoted).eq(0)) {
    return 0
  }

  if (!totalBondedTokens) {
    return -1
  }

  return Number(
    new BigNumber(totalVoted)
      .div(getStakingCoinViewAmount(totalBondedTokens))
      .toFixed(4) // output is 0.1234 = 12.34%
  )
}

export const tallyReducer = (proposal: ProposalRaw, tally: Tally, totalBondedTokens: string): TallyWithExtra => {
  // if the proposal is out of voting, use the final result for the tally
  if (proposalFinalized(proposal)) {
    const resultKeys = Object.keys(proposal.final_tally_result);

    if (proposal.tally) {
      tally = proposal.tally;
    } else if (resultKeys.includes('tally')) {
      tally = (proposal.final_tally_result as { readonly tally: Tally; }).tally;
    } else {
      tally = proposal.final_tally_result as Tally;
    }
  }

  const totalVoted = getStakingCoinViewAmount(
    new BigNumber(tally.yes)
      .plus(tally.no)
      .plus(tally.abstain)
      .plus(tally.no_with_veto)
      .toString()
  );

  return {
    yes: getStakingCoinViewAmount(tally.yes),
    no: getStakingCoinViewAmount(tally.no),
    abstain: getStakingCoinViewAmount(tally.abstain),
    veto: getStakingCoinViewAmount(tally.no_with_veto),
    total: totalVoted,
    totalVotedPercentage: getTotalVotePercentage(
      proposal,
      totalBondedTokens,
      totalVoted
    ),
  }
}

const getDeposit = (proposal: ProposalRaw) => {
  const sum = proposal.total_deposit.filter(({ denom }) => denom === Store.state.authentication.network.stakingDenom);
  const s = sum.reduce((ss, cur) => { return ss.plus(cur.amount) }, new BigNumber(0));

  return getStakingCoinViewAmount(s.toString());
}

const proposalBeginTime = (proposal: ProposalRaw) => {
  switch (proposal.status) {
    case ProposalRawStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return proposal.submit_time
    case ProposalRawStatus.PROPOSAL_STATUS_VOTING_PERIOD:
      return proposal.voting_start_time
    case ProposalRawStatus.PROPOSAL_STATUS_PASSED:
    case ProposalRawStatus.PROPOSAL_STATUS_REJECTED:
      return proposal.voting_end_time
  }
}

const proposalEndTime = (proposal: ProposalRaw) => {
  switch (proposal.status) {
    case ProposalRawStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return proposal.deposit_end_time
    case ProposalRawStatus.PROPOSAL_STATUS_VOTING_PERIOD:
    // the end time lives in the past already if the proposal is finalized
    case ProposalRawStatus.PROPOSAL_STATUS_PASSED:
    case ProposalRawStatus.PROPOSAL_STATUS_REJECTED:
      return proposal.voting_end_time
  }
}

const proposalStatusMap = (status: ProposalRawStatus) => {
  switch (status) {
    case ProposalRawStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return ProposalStatus.DEPOSIT;
    case ProposalRawStatus.PROPOSAL_STATUS_VOTING_PERIOD:
      return ProposalStatus.VOTING;
    case ProposalRawStatus.PROPOSAL_STATUS_PASSED:
      return ProposalStatus.PASSED;
    case ProposalRawStatus.PROPOSAL_STATUS_REJECTED:
      return ProposalStatus.REJECTED;
    case ProposalRawStatus.PROPOSAL_STATUS_FAILED:
      return ProposalStatus.FAILED;
    case ProposalRawStatus.PROPOSAL_STATUS_UNSPECIFIED:
    default:
      return ProposalStatus.UNSPECIFIED;
  }
}

export const proposalReducer = (proposal: ProposalRaw, totalBondedTokens: string, detailedVotes: DetailedVote | null): Proposal => {
  const typeStringArray = proposal.content['@type'].split('.')
  const typeString = typeStringArray[typeStringArray.length - 1];
  const type = proposalTypeEnumDictionary[typeString] as ProposalType;

  return {
    id: Number(proposal.proposal_id),
    proposalId: String(proposal.proposal_id),
    type,
    title: proposal.content.title,
    description: proposal.content.description,
    creationTime: proposal.submit_time,
    status: proposalStatusMap(proposal.status),
    statusBeginTime: proposalBeginTime(proposal),
    statusEndTime: proposalEndTime(proposal),
    tally: detailedVotes ? tallyReducer(proposal, detailedVotes.tally, totalBondedTokens) : null,
    deposit: getDeposit(proposal),
    summary: getProposalSummary(type),
    detailedVotes: detailedVotes ? detailedVotes : null,
  }
}

export const topVoterReducer = (topVoter: Validator): TopVoterValidator => {
  return {
    name: topVoter.name,
    address: topVoter.operatorAddress,
    votingPower: topVoter.votingPower,
    picture: topVoter.picture,
    validator: topVoter,
  }
}
