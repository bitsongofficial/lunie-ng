import { FantokenParams, FanTokenWithStats } from 'src/models';
import { MutationTree } from 'vuex'
import { FantokenStateInterface } from './state'

const mutation: MutationTree<FantokenStateInterface> = {
  setFantokens(state, fantokens: FanTokenWithStats[]) {
    state.fantokens = fantokens;
  },
  setLoading(state, loading: boolean) {
    state.loading = loading;
  },
  setParams(state, params: FantokenParams) {
    state.params = params;
  },
  resetLoadingData(state) {
    state.loading = false;
  }
}

export default mutation;
