import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { TransferStateInterface } from './state';

const getters: GetterTree<TransferStateInterface, StateInterface> = {
  someAction (/* context */) {
    // your code
  }
};

export default getters;
