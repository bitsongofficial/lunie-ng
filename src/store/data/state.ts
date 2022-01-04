import { Balance, BlockReduced } from 'src/models';

export interface DataStateInterface {
  block: BlockReduced | undefined;
  balances: Balance[];
  balancesLoaded: boolean;
  rewards: [];
  rewardsLoaded: boolean;
}

function state (): DataStateInterface {
  return {
    block: undefined,
    balances: [],
    balancesLoaded: false,
    rewards: [],
    rewardsLoaded: false
  }
}

export default state;
/* const validatorsMap = keyBy(validators, 'operatorAddress'); */
