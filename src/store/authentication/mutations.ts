import { Session, NetworkConfig } from 'src/models';
import { MutationTree } from 'vuex'
import { AuthenticationStateInterface } from './state'

const mutation: MutationTree<AuthenticationStateInterface> = {
  setSession(state, session: Session) {
    state.session = session;
  },
  setNetwork(state, network: NetworkConfig) {
    state.network = Object.assign({ supplyURL: undefined } , network);
  },
  setLoading(state, loading: boolean) {
    state.loading = loading;
  },
  setChanging(state, changing: boolean) {
    state.changing = changing;
  },
}

export default mutation;
