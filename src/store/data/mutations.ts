import { BlockReduced } from 'src/models';
import { MutationTree } from 'vuex'
import { DataStateInterface } from './state'

const mutation: MutationTree<DataStateInterface> = {
  setBlock(state, block: BlockReduced) {
    state.block = block;
  },
}

export default mutation;
