import { api } from 'src/boot/axios';
import { BigNumber } from 'bignumber.js';
import { BlockResponse } from '@cosmjs/launchpad';
import { blockReducer, coinReducer, delegationReducer, rewardReducer, undelegationReducer, balanceReducer } from 'src/common/cosmos-reducer';
import {
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
  UnbondingDelegation
} from 'src/models';
/* import { urlSafeEncode } from 'src/common/b64'; */
import { chunk, compact, reduce } from 'lodash';
import { network } from 'src/constants';

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

const getDelegationsForDelegator = async (address: string, validatorsDictionary: { [key: string]: Validator }) => {
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

const getUndelegationsForDelegator = async (address: string, validatorsDictionary: { [key: string]: Validator }) => {
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

  return rewardReducer(rewards, validatorsDictionary);
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
