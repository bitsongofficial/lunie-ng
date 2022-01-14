import { Coin } from '@cosmjs/stargate';
import { Balance, BlockReduced, Delegation, GovernanceOverview, Pool, Proposal, Reward, SupplyResponse, UnbondingDelegation, Validator } from 'src/models';

export interface DataStateInterface {
  block: BlockReduced | undefined;
  firstBlock: BlockReduced | undefined;
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
  governanceOverview: GovernanceOverview | null;
  governanceOverviewLoaded: boolean;
  validatorDelegations: Delegation[];
  validatorDelegationsLoading: boolean;
  supplyInfo: SupplyResponse | null;
  loadingSupplyInfo: boolean;
  selfStakeValidator: number;
  selfStakeValidatorLoading: boolean;
  loadingSignTransaction: boolean;
  loading: boolean;
  loadingDataDetails: boolean;
  supply: Coin | null;
  communityPool: Coin[];
  apr: string | null;
  loadingApr: boolean;
  inflation: string | null;
  pool: Pool | null;
}

function state (): DataStateInterface {
  return {
    block: undefined,
    firstBlock: undefined,
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
    proposalsLoaded: false,
    governanceOverview: null,
    governanceOverviewLoaded: false,
    validatorDelegations: [],
    validatorDelegationsLoading: false,
    selfStakeValidator: 0,
    selfStakeValidatorLoading: false,
    loadingSignTransaction: false,
    loading: false,
    loadingDataDetails: false,
    supplyInfo: null,
    loadingSupplyInfo: false,
    supply: null,
    communityPool: [],
    apr: null,
    loadingApr: false,
    inflation: null,
    pool: null
  }
}

export default state;
