import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { DataStateInterface } from './state';
import {
  getBalances,
  getBlock,
  getDelegationsForDelegator,
  getUndelegationsForDelegator,
  getRewards,
  loadValidators,
  getProposals,
  getGovernanceOverview,
  getValidatorDelegations,
  getSelfStake
} from 'src/services';
import { keyBy } from 'lodash';
import { updateValidatorImages } from 'src/common/keybase';
import { Validator } from 'src/models';
import { network } from 'src/constants';

const actions: ActionTree<DataStateInterface, StateInterface> = {
  resetSessionData({ commit }) {
    commit('resetSessionData');
  },
  async refresh({ dispatch, commit }) {
    try {
      await dispatch('getValidators');
      await dispatch('getFirstBlock');
      await dispatch('getBlock');
      await dispatch('refreshSession');
      await dispatch('getProposals');
      await dispatch('getGovernanceOverview');
    } catch (error) {
      console.error(error);

        if (error instanceof Error) {
          commit(
            'notifications/add',
            {
              type: 'danger',
              message: 'Refresh failed:' + error.message,
            },
            { root: true }
          );
        }

        throw error;
    }
  },
  async refreshSession({ dispatch, commit, rootState }) {
    const session = rootState.authentication.session;

    if (session) {
      const address = session.address;

      try {
        await dispatch('getBalances', { address });
        await dispatch('getRewards', { address });
        await dispatch('getDelegations', address);
        await dispatch('getUndelegations', address);
        /* await dispatch('getTransactions', { address }); */
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          commit(
            'notifications/add',
            {
              type: 'danger',
              message: 'Refresh session failed:' + error.message,
            },
            { root: true }
          );
        }

        throw error;
      }
    }
  },
  async getFirstBlock ({ commit }) {
    try {
      const block = await getBlock(network.minBlockHeight);
      commit('setFirstBlock', block);

      return block;
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting first block failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    }
  },
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
  },
  async getBalances({ commit, getters }, { address }) {
    try {
      commit('setBalancesLoaded', false);
      const balances = await getBalances(address, getters['validatorsDictionary']);
      commit('setBalances', balances);
      commit('setBalancesLoaded', true);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting balances failed:' + err.message,
          },
          { root: true }
        );
      }

      throw err;
    }
  },
  async getDelegations({ commit, getters }, address) {
    try {
      commit('setDelegationsLoaded', false);
      const delegations = await getDelegationsForDelegator(address, getters['validatorsDictionary']);
      commit('setDelegations', delegations);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting delegations failed:' + err.message,
          },
          { root: true }
        );
      }
    } finally {
      commit('setDelegationsLoaded', true);
    }
  },
  async getUndelegations({ commit, getters }, address) {
    try {
      commit('setUndelegationsLoaded', false);
      const undelegations = await getUndelegationsForDelegator(address, getters['validatorsDictionary']);
      commit('setUndelegations', undelegations);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting undelegations failed:' + err.message,
          },
          { root: true }
        );
      }
    } finally {
      commit('setUndelegationsLoaded', true);
    }
  },
  async getRewards({ commit, getters }, { address }) {
    try {
      commit('setRewardsLoaded', false)
      const rewards = await getRewards(address, getters['validatorsDictionary']);
      commit('setRewards', rewards);
      commit('setRewardsLoaded', true);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting rewards failed:' + err.message,
          },
          { root: true }
        );
      }
    }
  },
  async getValidators({ commit, dispatch }) {
    try {
      commit('setValidatorsLoaded', false);
      const validators = await loadValidators();
      commit('setValidators', validators);
      commit('setValidatorsLoaded', true);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting validators failed:' + err.message,
          },
          { root: true }
        );
      }
    }

    await dispatch('updateValidatorImages');
  },
  async updateValidatorImages({ state, commit }) {
    // get validator images for chunk
    await updateValidatorImages(state.validators, (updatedChunk) => {
      const updatedValidatorsDict = keyBy(updatedChunk, 'operatorAddress')
      // update the validators from our chunk
      const updatedValidators = state.validators.map((validator) => {
        const updatedValidator = updatedValidatorsDict[validator.operatorAddress];

        if (updatedValidator) {
          return updatedValidator;
        }

        return validator;
      })

      // update the store and UI
      commit('setValidators', updatedValidators);
    })
  },
  async getProposals({ commit, getters }) {
    try {
      commit('setProposalsLoaded', false);
      const proposals = await getProposals(getters['validatorsDictionary']);

      commit('setProposals', proposals);
      commit('setProposalsLoaded', true);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting proposals failed:' + err.message,
          },
          { root: true }
        );
      }
    }
  },
  async getGovernanceOverview({ commit, getters }) {
    try {
      commit('setGovernanceOverviewLoaded', false);
      const governanceOverview = await getGovernanceOverview(getters['topVoters']);
      commit('setGovernanceOverview', governanceOverview);
      commit('setGovernanceOverviewLoaded', true);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting governanceOverview failed:' + err.message,
          },
          { root: true }
        );
      }
    }
  },
  async getValidatorDelegations({ commit }, validator: Validator) {
    try {
      commit('setValidatorDelegations', []);
      commit('setValidatorDelegationsLoading', true);
      const delegations = await getValidatorDelegations(validator);

      commit('setValidatorDelegations', delegations);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting validator delegations failed:' + err.message,
          },
          { root: true }
        );
      }
    } finally {
      commit('setValidatorDelegationsLoading', false);
    }
  },
  async getValidatorSelfStake({ commit }, validator: Validator) {
    try {
      commit('setSelfStakeValidator', 0);
      commit('setSelfStakeValidatorLoading', true);
      const selfStake = await getSelfStake(validator);

      commit('setSelfStakeValidator', selfStake);
    } catch (err) {
      if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting validator self stake failed:' + err.message,
          },
          { root: true }
        );
      }
    } finally {
      commit('setSelfStakeValidatorLoading', false);
    }
  },
}

export default actions;
