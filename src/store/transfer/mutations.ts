import { MutationTree } from 'vuex';
import { TransferStateInterface } from './state';

const mutation: MutationTree<TransferStateInterface> = {
  setSending(state, value: boolean) {
    state.sending = value;
  }
};

export default mutation;
