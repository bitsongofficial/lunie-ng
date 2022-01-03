import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';
import { getBlock } from 'src/services';

const actions: ActionTree<DataStateInterface, StateInterface> = {
  async getBlock ({ commit }) {
    try {
      const block = await getBlock();
      commit('setBlock', block);

      return block;
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting block failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    }
  }
}

export default actions;
