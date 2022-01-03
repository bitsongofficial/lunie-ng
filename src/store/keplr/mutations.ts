import { AccountData } from '@cosmjs/proto-signing';
import { MutationTree } from 'vuex'
import { KeplrStateInterface } from './state'

const mutation: MutationTree<KeplrStateInterface> = {
  setAccounts(state, accounts: AccountData[]) {
    state.accounts = accounts;
  },
  setInitialized(state) {
    state.initialized = true;
  },
  setError(state, error: Error) {
    state.error = error;
  },
  setLoading(state, loading: boolean) {
    state.loading = loading;
  },
}

export default mutation;
