import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { FantokenStateInterface } from './state';

const getters: GetterTree<FantokenStateInterface, StateInterface> = {
  fantokenByOwner({ fantokens }, _getters, { authentication }) {
    return fantokens.filter(fantoken => fantoken.owner === authentication.session?.address);
  },
  fantokenLoading({ loading }, _getters, { data }) {
    return loading || !data.balancesLoaded;
  }
}

export default getters;
