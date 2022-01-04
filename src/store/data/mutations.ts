import { BlockReduced } from 'src/models';
import { MutationTree } from 'vuex'
import { DataStateInterface } from './state'

const mutation: MutationTree<DataStateInterface> = {
  setBlock(state, block: BlockReduced) {
    state.block = block;
  },
  setBalances(state, balances: []) {
    state.balances = balances;
  },
  setBalancesLoaded(state, balancesLoaded: boolean) {
    state.balancesLoaded = balancesLoaded;
  },
  resetSessionData(state) {
    state.balances = [];
    state.rewards = [];
    /* state.delegations = []
    state.undelegations = [] */
    state.rewards = [];
    /* state.transactions = []
    state.moreTransactionsAvailable = true */
  },
}

export default mutation;
