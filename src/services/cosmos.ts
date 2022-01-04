import { api } from 'src/boot/axios';
import { BigNumber } from 'bignumber.js';
import { BlockResponse } from '@cosmjs/launchpad';
import { blockReducer, coinReducer, delegationReducer, rewardReducer, undelegationReducer, balanceReducer, validatorReducer, depositReducer, voteReducer, proposalReducer, getStakingCoinViewAmount, topVoterReducer } from 'src/common/cosmos-reducer';
import {
  PoolResponse,
  BalanceResponse,
  PaginationResponse,
  BlockReduced,
  ValidatorStatus,
  Validator,
  DelegationResponse,
  DenomTraceResponse,
  ClientStateResponse,
  RewardsResponse,
  Reward,
  BalanceCoin,
  UnbondingDelegationResponse,
  UnbondingDelegationFlat,
  UnbondingDelegationRaw,
  Delegation,
  UnbondingDelegation,
  ValidatorStatusRequest,
  AnnualProvisionsResponse,
  ValidatorResponse,
  ProposalResponse,
  GovParamsResponse,
  TallyParams,
  DepositParams,
  ProposalRaw,
  ProposalRawStatus,
  VoteResponse,
  DepositResponse,
  ValidatorMap,
  DetailedVote,
  CommunityPoolResponse,
  GovernanceOverview
} from 'src/models';
/* import { urlSafeEncode } from 'src/common/b64'; */
import { chunk, compact, orderBy, reduce } from 'lodash';
import { network } from 'src/constants';
import Store from 'src/store';
import { Tally } from '@cosmjs/launchpad/build/lcdapi/gov';
import { percentage, setDecimalLength } from 'src/common/numbers';
import { getCoinLookup } from 'src/common/network';

const GOLANG_NULL_TIME = '0001-01-01T00:00:00Z'; // time that gets serialized from null in golang

export const getBlock = async (blockHeight: number | undefined = undefined): Promise<BlockReduced> => {
  try {
    const response = await api.get<BlockResponse>(`blocks/${blockHeight ?? 'latest'}`);

    return blockReducer(response.data);
  } catch (error) {
    throw error;
  }
};

export const queryAutoPaginate = async <T extends PaginationResponse>(url: string) => {
  try {
    const response = await api.get<T>(url);
    const paginatedData = response.data;

    /* while (response.data.pagination !== null && response.data.pagination.next_key !== null) {
      const data = await api.get<T>(url + `?pagination.key=${urlSafeEncode(response.data.pagination.next_key)}`);
      paginatedData = paginatedData.concat(data.data.pagination);
    } */

    return paginatedData;
  } catch (error) {
    throw error;
  }
}

export const getDelegationsForDelegator = async (address: string, validatorsDictionary: { [key: string]: Validator }) => {
  const delegations = await queryAutoPaginate<DelegationResponse>(
    `cosmos/staking/v1beta1/delegations/${address}`
  );

  const delegationsReduced = delegations.delegation_responses.length ? delegations.delegation_responses.map((delegation) =>
    delegationReducer(
      delegation,
      validatorsDictionary[delegation.delegation.validator_address],
      ValidatorStatus.ACTIVE
    )
  ) : [];

  return compact(delegationsReduced).filter((delegation) => new BigNumber(delegation.amount).gt(0));
}

export const getUndelegationsForDelegator = async (address: string, validatorsDictionary: { [key: string]: Validator }) => {
  const response = await queryAutoPaginate<UnbondingDelegationResponse>(`cosmos/staking/v1beta1/delegators/${address}/unbonding_delegations`);

  const undelegations = response ? response.unbonding_response : [];

  // undelegations come in a nested format { validator_address, delegator_address, entries }
  // we flatten the format to be able to easier iterate over the list
  const flattenedUndelegations = reduce<UnbondingDelegationRaw, UnbondingDelegationFlat[]>(undelegations, (list, undelegation) => {
    return list.concat(
      undelegation.entries.map((entry) => ({
        validator_address: undelegation.validator_address,
        delegator_address: undelegation.delegator_address,
        balance: entry.balance,
        completion_time: entry.completion_time,
        creation_height: entry.creation_height,
        initial_balance: entry.initial_balance,
      }))
    );
  }, []);

  return flattenedUndelegations.map((undelegation) =>
    undelegationReducer(
      undelegation,
      validatorsDictionary[undelegation.validator_address]
    )
  );
}

export const getIbcInfo = async (traceId: string) => {
  if (traceId.startsWith('ibc/')) {
    traceId = traceId.split('/')[1];
  }

  const result = await api.get<DenomTraceResponse>(`/ibc_transfer/v1beta1/denom_traces/${traceId}`);
  const trace = result.data.denom_trace;

  const chainTrace = await Promise.all(
    chunk(trace.path.split('/'), 2).map(async ([port, channel]) => {
      const result = await api.get<ClientStateResponse>(`/ibc/channel/v1beta1/channels/${channel}/ports/${port}/client_state`);

      return result.data.identified_client_state.client_state.chain_id;
    }),
  );

  return {
    denom: trace.base_denom,
    chainTrace,
  }
}

export const getRewards = async (delegatorAddress: string, validatorsDictionary: { [key: string]: Validator }): Promise<Array<Reward | null>> => {
  const result = await api.get<RewardsResponse>(`cosmos/distribution/v1beta1/delegators/${delegatorAddress}/rewards`);

  const rewards = (result.data.rewards || []).filter(
    ({ reward }) => reward && reward.length > 0
  );

  return compact(rewardReducer(rewards, validatorsDictionary));
}

export const getValidators = async (status: ValidatorStatusRequest) => {
  const response = await api.get<ValidatorResponse>(`staking/validators?status=${status}`);

  return response.data;
}

export const getAnnualProvision = async () => {
  const response = await api.get<AnnualProvisionsResponse>('cosmos/mint/v1beta1/annual_provisions');

  return response.data.annual_provisions;
}

export const getPool = async () => {
  const response = await api.get<PoolResponse>('cosmos/staking/v1beta1/pool');

  return response.data;
}

export const getCommunityPool = async () => {
  const response = await api.get<CommunityPoolResponse>('cosmos/distribution/v1beta1/community_pool');

  return response.data;
}

export const loadValidators = async () => {
  const [
    { result: bondedValidators },
    { result: unbondingValidators },
    { result: unbondedValidators },
    { result: unspecifiedValidators },
    annualProvision,
    pool
  ] = await Promise.all([
    getValidators(ValidatorStatusRequest.BOND_STATUS_BONDED),
    getValidators(ValidatorStatusRequest.BOND_STATUS_UNBONDING),
    getValidators(ValidatorStatusRequest.BOND_STATUS_UNBONDED),
    getValidators(ValidatorStatusRequest.BOND_STATUS_UNSPECIFIED),
    getAnnualProvision(),
    getPool()
  ]);

  const totalShares = bondedValidators.reduce(
    (sum, { delegator_shares: delegatorShares }) => sum.plus(delegatorShares),
    new BigNumber(0)
  );

  const allValidators = bondedValidators.concat(unbondingValidators, unbondedValidators, unspecifiedValidators)
  return allValidators.map(validator => validatorReducer(validator, annualProvision, totalShares, pool))
}

export const getBalances = async (address: string, validatorsDictionary: { [key: string]: Validator }) => {
  let delegations: Delegation[] = [];
  let undelegations: UnbondingDelegation[] = [];

  try {
    delegations = await getDelegationsForDelegator(address, validatorsDictionary);
  } catch (error) {
    console.error(error);
  }

  try {
    undelegations = await getUndelegationsForDelegator(address, validatorsDictionary);
  } catch (error) {
    console.error(error);
  }

  try {
    const balancesResponse = await queryAutoPaginate<BalanceResponse>(`cosmos/bank/v1beta1/balances/${address}`);

    const balances = balancesResponse ? balancesResponse.balances : [];

    const coins = await Promise.all(
      balances.map(async (balance) => {
        let ibcInfo;
        if (balance.denom.startsWith('ibc/')) {
          ibcInfo = await getIbcInfo(balance.denom);
        }

        return coinReducer(balance, ibcInfo);
      })
    );

    // also check if there are any denoms as rewards the user has not as a balance
    // we need to show those as well in the balance overview as we show the rewards there
    const rewards = await getRewards(address, validatorsDictionary);

    const rewardsBalancesReduce = reduce<Reward, BalanceCoin[]>(compact(rewards), (coinsAggregator, reward) => {
      if (
        reward &&
        !coins.find((coin) => coin.denom === reward.denom) &&
        !coinsAggregator.find((coin) => coin.denom === reward.denom)
      ) {
        coinsAggregator.push({
          amount: 0,
          denom: reward.denom,
        });
      }

      return coinsAggregator;
    }, []);

    // join regular balances and rewards balances
    coins.push(...rewardsBalancesReduce);

    // the user might not have liquid staking tokens but have staking tokens delegated
    // if we don't add the staking denom, we would show a 0 total for the staking denom which is wrong
    const hasStakingDenom = coins.find(
      ({ denom }) => denom === network.stakingDenom
    );

    if (!hasStakingDenom) {
      coins.push({
        amount: new BigNumber(0),
        denom: network.stakingDenom,
      });
    }

    return coins.map((coin) => balanceReducer(coin, delegations, undelegations));
  } catch (error) {
    throw error;
  }
}

export const getTallying = async () => {
  const response = await api.get<GovParamsResponse>('cosmos/gov/v1beta1/params/tallying');

  return response.data;
}

export const getDeposit = async () => {
  const response = await api.get<GovParamsResponse>('cosmos/gov/v1beta1/params/deposit');

  return response.data;
}

const getChainStartTime = () => {
  return new Date(Store.state.data.block?.time ?? 0);
}

const dataExistsInThisChain = (timestamp: string | number) => {
  return new Date(timestamp) > getChainStartTime();
}

const getVotes = async (proposal: ProposalRaw) => {
  const response = await queryAutoPaginate<VoteResponse>(`/cosmos/gov/v1beta1/proposals/${proposal.proposal_id}/votes`);

  return response.votes;
}

const getDeposits = async (proposal: ProposalRaw) => {
  const response = await queryAutoPaginate<DepositResponse>(`/cosmos/gov/v1beta1/proposals/${proposal.proposal_id}/deposits`);

  return response.deposits;
}

export const getDetailedVotes = async (proposal: ProposalRaw, tallyParams: TallyParams, depositParams: DepositParams, validators: ValidatorMap): Promise<DetailedVote> => {
  const dataAvailable = dataExistsInThisChain(proposal.submit_time);
  const votingComplete = [
    ProposalRawStatus.PROPOSAL_STATUS_PASSED,
    ProposalRawStatus.PROPOSAL_STATUS_REJECTED
  ].includes(proposal.status);

  const votes = dataAvailable ? await getVotes(proposal) : []
  const deposits = dataAvailable ? await getDeposits(proposal) : []
  let tally = proposal.final_tally_result;

  if (!votingComplete) {
    const response = await api.get<Tally>(`/cosmos/gov/v1beta1/proposals/${proposal.proposal_id}/tally`);

    tally = response.data;
  }

  const totalVotingParticipation = new BigNumber(tally.yes)
    .plus(tally.abstain)
    .plus(tally.no)
    .plus(tally.no_with_veto);

  const formattedDeposits = deposits.length ?
    deposits.map(
      (deposit) => depositReducer(deposit, validators),
    )
    :
    [];

  const depositsSum = deposits.length ?
    formattedDeposits.reduce<number>((depositAmountAggregator, deposit) => {
      return (depositAmountAggregator += deposit.amount.length ? Number(deposit.amount[0].amount) : 0)
    }, 0)
    :
    0;

  return {
    deposits: formattedDeposits,
    depositsSum: deposits.length ? Number(depositsSum).toFixed(6) : [],
    percentageDepositsNeeded: deposits ?
      percentage(
        depositsSum,
        new BigNumber(depositParams.min_deposit[0].amount)
      )
      :
      [],
    votes: votes.length ? votes.map((vote) => voteReducer(vote, validators)) : [],
    votesSum: votes ? votes.length : [],
    votingThresholdYes: Number(tallyParams.threshold).toFixed(2),
    votingThresholdNo: (1 - parseFloat(tallyParams.threshold)).toFixed(2),
    votingPercentageYes: percentage(tally.yes, totalVotingParticipation),
    votingPercentageNo: percentage(
      new BigNumber(tally.no).plus(tally.no_with_veto),
      totalVotingParticipation
    ),
    tally: tally,
    timeline: [
      proposal.submit_time
        ? { title: 'Created', time: proposal.submit_time }
        : undefined,
      proposal.deposit_end_time
        ? {
          title: 'Deposit Period Ends',
          // the deposit period can end before the time as the limit is reached already
          time:
            proposal.voting_start_time !== GOLANG_NULL_TIME &&
              new Date(proposal.voting_start_time) <
              new Date(proposal.deposit_end_time)
              ? proposal.voting_start_time
              : proposal.deposit_end_time,
        }
        : [],
      proposal.voting_start_time
        ? {
          title: 'Voting Period Starts',
          time:
            proposal.voting_start_time !== GOLANG_NULL_TIME
              ? proposal.voting_start_time
              : [],
        }
        : [],
      proposal.voting_end_time
        ? {
          title: 'Voting Period Ends',
          time:
            proposal.voting_end_time !== GOLANG_NULL_TIME
              ? proposal.voting_end_time
              : [],
        }
        : [],
    ].filter((x) => !!x),
  }
}

export const getProposals = async (validators: ValidatorMap) => {
  const [
    proposalsResponse,
    { pool },
    { tally_params: tallyParams },
    { deposit_params: depositParams },
  ] = await Promise.all([
    queryAutoPaginate<ProposalResponse>('cosmos/gov/v1beta1/proposals'),
    getPool(),
    getTallying(),
    getDeposit()
  ]);

  if (!Array.isArray(proposalsResponse.proposals)) {
    return [];
  }

  const proposals = await Promise.all(
    proposalsResponse.proposals.map(async (proposal) => {
      const detailedVotes = await getDetailedVotes(proposal, tallyParams, depositParams, validators);

      return proposalReducer(
        proposal,
        pool.bonded_tokens,
        detailedVotes,
      );
    })
  );

  return orderBy(proposals, 'id', 'desc');
}

export const getGovernanceOverview = async (topVoters: Validator[]): Promise<GovernanceOverview> => {
  const [pool, communityPoolArray] = await Promise.all([
    getPool(),
    getCommunityPool(),
  ])

  const stakingCoin = getCoinLookup(
    network.stakingDenom,
    'viewDenom'
  );

  const stakingChainDenom = stakingCoin?.chainDenom;

  const communityPool = communityPoolArray.pool.find(
    ({ denom }) => denom === stakingChainDenom
  );

  return {
    totalStakedAssets: setDecimalLength(
      new BigNumber(getStakingCoinViewAmount(pool.pool.bonded_tokens)).toNumber(),
      2
    ),
    totalVoters: undefined,
    treasurySize: setDecimalLength(
      !communityPool ? 0 : new BigNumber(getStakingCoinViewAmount(communityPool.amount)).toNumber(),
      2
    ),
    topVoters: topVoters.map((topVoter) =>
      topVoterReducer(topVoter)
    ),
  };
}
