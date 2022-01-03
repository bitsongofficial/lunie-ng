import { api } from 'src/boot/axios';
import { BigNumber } from 'bignumber.js';
import { BlockResponse } from '@cosmjs/launchpad';
import { blockReducer, delegationReducer } from 'src/common/cosmos-reducer';
import { BalanceResponse, PaginationResponse, BlockReduced, ValidatorStatus, Validator, DelegationResponse } from 'src/models';
/* import { urlSafeEncode } from 'src/common/b64'; */
import { keyBy } from 'lodash';

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

const getDelegationsForDelegator = async (address: string, validators: Validator[]) => {
  const delegations = await queryAutoPaginate<DelegationResponse>(
    `cosmos/staking/v1beta1/delegations/${address}`
  );

  const validatorsMap = keyBy(validators, 'operatorAddress');

  return delegations.delegation_responses.length ? delegations.delegation_responses
    .map((delegation) =>
      delegationReducer(
        delegation,
        validatorsMap[delegation.delegation.validator_address],
        ValidatorStatus.ACTIVE
      )
    )
    .filter((delegation) => delegation && new BigNumber(delegation.amount).gt(0)) : [];
}

export const getBalances = async (address: string, validators: Validator[]) => {
  try {
    const [balancesResponse, delegations, /* undelegations */] = await Promise.all([
      queryAutoPaginate<BalanceResponse>(`cosmos/bank/v1beta1/balances/${address}`),
      getDelegationsForDelegator(address, validators),
      /* getUndelegationsForDelegator(address), */
    ]);

    console.log(balancesResponse, delegations);
  } catch (error) {
    throw error;
  }

  /* const balances = balancesResponse || []
  const coins = await Promise.all(
    balances.map(async (balance) => {
      let ibcInfo
      if (balance.denom.startsWith('ibc/')) {
        ibcInfo = await this.getIbcInfo(balance.denom)
      }
      return this.reducers.coinReducer(balance, ibcInfo)
    })
  )
  // also check if there are any denoms as rewards the user has not as a balance
  // we need to show those as well in the balance overview as we show the rewards there
  const rewards = await this.getRewards(address)
  const rewardsBalances = rewards.reduce((coinsAggregator, reward) => {
    if (
      !coins.find((coin) => coin.denom === reward.denom) &&
      !coinsAggregator.find((coin) => coin.denom === reward.denom)
    ) {
      coinsAggregator.push({
        amount: 0,
        denom: reward.denom,
      })
    }
    return coinsAggregator
  }, [])
  // join regular balances and rewards balances
  coins.push(...rewardsBalances)

  // the user might not have liquid staking tokens but have staking tokens delegated
  // if we don't add the staking denom, we would show a 0 total for the staking denom which is wrong
  const hasStakingDenom = coins.find(
    ({ denom }) => denom === this.network.stakingDenom
  )

  if (!hasStakingDenom) {
    coins.push({
      amount: BigNumber(0),
      denom: this.network.stakingDenom,
    })
  }
  return coins.map((coin) => {
    return this.reducers.balanceReducer(coin, delegations, undelegations)
  }) */
}
