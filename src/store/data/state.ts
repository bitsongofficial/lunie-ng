import { Coin } from '@cosmjs/stargate';
import { Balance, BlockReduced, Delegation, DepositParams, GovernanceOverview, Pool, Proposal, Reward, SupplyResponse, UnbondingDelegation, Validator } from 'src/models';
import { CoinGeckoResponse } from 'src/models/coin-gecko';

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
  coinDetails: CoinGeckoResponse | null;
  loadingCoinDetails: boolean;
  depositParams: DepositParams | null;
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
    pool: null,
    coinDetails: null,
    loadingCoinDetails: false,
    depositParams: null
  }
}

export default state;
