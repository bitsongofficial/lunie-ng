import { Balance, BlockReduced, Delegation, Proposal, Reward, UnbondingDelegation, Validator } from 'src/models';

export interface DataStateInterface {
  block: BlockReduced | undefined;
  balances: Balance[];
  balancesLoaded: boolean;
  delegations: Delegation[];
  delegationsLoaded: boolean;
  undelegations: UnbondingDelegation[];
  undelegationsLoaded: boolean;
  validators: Validator[];
  validatorsLoaded: boolean;
  rewards: Reward[];
  rewardsLoaded: boolean;
  proposals: Proposal[];
  proposalsLoaded: boolean;
}

function state (): DataStateInterface {
  return {
    block: undefined,
    balances: [],
    balancesLoaded: false,
    delegations: [],
    delegationsLoaded: false,
    undelegations: [],
    undelegationsLoaded: false,
    validators: [],
    validatorsLoaded: false,
    rewards: [],
    rewardsLoaded: false,
    proposals: [],
    proposalsLoaded: false
  }
}

export default state;
