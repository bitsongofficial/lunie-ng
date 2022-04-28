import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { ProposalStateInterface } from './state';
import mutations from './mutations';

const proposalModule: Module<ProposalStateInterface, StateInterface> = {
  namespaced: true,
  mutations,
  state
}

export default proposalModule;
