import { Coin } from '@cosmjs/stargate';
import { Balance, BlockReduced, Delegation, GovernanceOverview, Pool, Proposal, Reward, SupplyResponse, UnbondingDelegation, Validator } from 'src/models';
import { MutationTree } from 'vuex';
import { DataStateInterface } from './state';

const mutation: MutationTree<DataStateInterface> = {
  setFirstBlock(state, firstBlock: BlockReduced) {
    state.firstBlock = firstBlock;
  },
  setBlock(state, block: BlockReduced) {
    state.block = block;
  },
  setBalances(state, balances: Balance[]) {
    state.balances = balances;
  },
  setBalancesLoaded(state, balancesLoaded: boolean) {
    state.balancesLoaded = balancesLoaded;
  },
  setDelegations(state, delegations: Delegation[]) {
    state.delegations = delegations;
  },
  setDelegationsLoaded(state, delegationsLoaded: boolean) {
    state.delegationsLoaded = delegationsLoaded;
  },
  setUndelegations(state, undelegations: UnbondingDelegation[]) {
    state.undelegations = undelegations;
  },
  setUndelegationsLoaded(state, undelegationsLoaded: boolean) {
    state.undelegationsLoaded = undelegationsLoaded;
  },
  setValidators(state, validators: Validator[]) {
    state.validators = validators;
  },
  setValidatorsLoaded(state, validatorsLoaded: boolean) {
    state.validatorsLoaded = validatorsLoaded;
  },
  setRewards(state, rewards: Reward[]) {
    state.rewards = rewards;
  },
  setRewardsLoaded(state, rewardsLoaded: boolean) {
    state.rewardsLoaded = rewardsLoaded;
  },
  setProposals(state, proposals: Proposal[]) {
    state.proposals = proposals;
  },
  setProposalsLoaded(state, proposalsLoaded: boolean) {
    state.proposalsLoaded = proposalsLoaded;
  },
  setGovernanceOverview(state, governanceOverview: GovernanceOverview) {
    state.governanceOverview = governanceOverview;
  },
  setGovernanceOverviewLoaded(state, governanceOverviewLoaded: boolean) {
    state.governanceOverviewLoaded = governanceOverviewLoaded;
  },
  setValidatorDelegations(state, validatorDelegations: Delegation[]) {
    state.validatorDelegations = validatorDelegations;
  },
  setValidatorDelegationsLoading(state, validatorDelegationsLoading: boolean) {
    state.validatorDelegationsLoading = validatorDelegationsLoading;
  },
  setSelfStakeValidator(state, selfStakeValidator: number) {
    state.selfStakeValidator = selfStakeValidator;
  },
  setSelfStakeValidatorLoading(state, selfStakeValidatorLoading: boolean) {
    state.selfStakeValidatorLoading = selfStakeValidatorLoading;
  },
  setLoadingSignTransaction(state, loadingSignTransaction: boolean) {
    state.loadingSignTransaction = loadingSignTransaction;
  },
  setLoading(state, loading: boolean) {
    state.loading = loading;
  },
  setLoadingSupplyInfo(state, loading: boolean) {
    state.loadingSupplyInfo = loading;
  },
  setSupplyInfo(state, supplyInfo: SupplyResponse) {
    state.supplyInfo = supplyInfo;
  },
  setLoadingAPR(state, loadingApr: boolean) {
    state.loadingApr = loadingApr;
  },
  setApr(state, apr: string) {
    state.apr = apr;
  },
  setPool(state, pool: Pool) {
    state.pool = pool;
  },
  setInflation(state, inflation: string) {
    state.inflation = inflation;
  },
  setSupply(state, supply: Coin) {
    state.supply = supply;
  },
  setCommunityPool(state, communityPool: Coin[]) {
    state.communityPool = communityPool;
  },
  resetSessionData(state) {
    state.supplyInfo = null;
    state.inflation = null;
    state.supply = null;
    state.communityPool = [];
    state.pool = null;
    state.apr = null;
    state.balances = [];
    state.rewards = [];
    state.delegations = []
    state.undelegations = []
    state.rewards = [];
    state.validators = [];
    state.proposals = [];
  },
}

export default mutation;
