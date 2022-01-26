import { FanToken } from '@bitsongjs/sdk/build/codec/fantoken/fantoken';
import { MutationTree } from 'vuex'
import { FantokenStateInterface } from './state'

const mutation: MutationTree<FantokenStateInterface> = {
  setFantokens(state, fantokens: FanToken[]) {
    state.fantokens = fantokens;
  },
  setLoading(state, loading: boolean) {
    state.loading = loading;
  },
  resetLoadingData(state) {
    state.loading = false;
  }
}

export default mutation;
