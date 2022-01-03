import { Session } from 'src/models';
import { MutationTree } from 'vuex'
import { AuthenticationStateInterface } from './state'

const mutation: MutationTree<AuthenticationStateInterface> = {
  setSession(state, session: Session) {
    state.session = session;
  },
}

export default mutation;
