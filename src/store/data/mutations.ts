import { Balance, BlockReduced, Delegation, GovernanceOverview, Proposal, Reward, UnbondingDelegation, Validator } from 'src/models';
import { MutationTree } from 'vuex'
import { DataStateInterface } from './state'

const mutation: MutationTree<DataStateInterface> = {
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
  resetSessionData(state) {
    state.balances = [];
    state.rewards = [];
    state.delegations = []
    state.undelegations = []
    state.rewards = [];
  },
}

export default mutation;