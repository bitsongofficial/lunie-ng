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
  getSelfStake,
  getAccountInfo,
  getSupplyInfo,
  getPool,
  getInflation,
  getCommunityPool,
  getSupplyByDenom,
  getDeposit
} from 'src/services';
import { keyBy } from 'lodash';
import { updateValidatorImages } from 'src/common/keybase';
import { AccountInfo, BlockReduced, TransactionRequest, Validator } from 'src/models';
import { createSignBroadcast, pollTxInclusion } from 'src/signing/transaction-manager';
import { getAPR } from 'src/common/numbers';
import { getCoinLookup } from 'src/common/network';
import { getStakingCoinViewAmount } from 'src/common/cosmos-reducer';
import { getCoinGeckoDetails } from 'src/services/coin-gecko';

const actions: ActionTree<DataStateInterface, StateInterface> = {
  resetSessionData({ commit }) {
    commit('resetSessionData');
  },
  async refresh({ dispatch, commit }) {
    try {
      commit('setLoading', true);
      dispatch('getSupplyInfo').catch(err => console.error(err));
      await dispatch('getBlock');
      await dispatch('getDepositParams');
      await dispatch('getValidators');

      await dispatch('refreshSession');
      dispatch('getProposals').catch(err => console.error(err));
      dispatch('getGovernanceOverview').catch(err => console.error(err));
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
    } finally {
      commit('setLoading', false);
    }
  },
  async refreshSession({ dispatch, commit, rootState }) {
    const session = rootState.authentication.session;

    if (session) {
      const address = session.address;

      try {
        commit('setLoading', true);
        await dispatch('getCoinGeckoDetails');
        await dispatch('getBalances', { address });
        await dispatch('getRewards', { address });
        await dispatch('getDelegations', address);
        await dispatch('getUndelegations', address);
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
      } finally {
        commit('setLoading', false);
      }
    }
  },
  async getSupplyInfo({ commit, dispatch }) {
    try {
      commit('setLoadingSupplyInfo', true);
      const supplyInfo = await getSupplyInfo();
      commit('setSupplyInfo', supplyInfo);
    } catch (err) {
      /* if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting supply info failed:' + err.message,
          },
          { root: true }
        );
      } */

      throw err;
    } finally {
      commit('setLoadingSupplyInfo', false);

      await dispatch('getAPR');
    }
  },
  async getAPR({ commit, rootState }) {
    try {
      commit('setLoadingAPR', true);

      const supplyCoin = getCoinLookup(
        rootState.authentication.network.stakingDenom,
        'viewDenom'
      );

      const chainSupplyTotal = await getSupplyByDenom(supplyCoin ? supplyCoin.chainDenom : '');
      const communityPool = await getCommunityPool();

      commit('setSupply', chainSupplyTotal);
      commit('setCommunityPool', communityPool.pool);

      const chainSupplyCoin = getStakingCoinViewAmount(chainSupplyTotal ? chainSupplyTotal.amount : '0')

      const chainSupply = chainSupplyCoin.toString();

      const pool = await getPool();
      const inflation = await getInflation();

      if (chainSupplyTotal) {
        const apr = getAPR(chainSupply, inflation.inflation, pool.pool.bonded_tokens);

        commit('setApr', apr.toString());
      }

      commit('setPool', pool.pool);
      commit('setInflation', inflation.inflation);
    } catch (err) {
      console.error(err);
      /* if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting APR failed:' + err.message,
          },
          { root: true }
        );
      } */

      throw err;
    } finally {
      commit('setLoadingAPR', false);
    }
  },
  /* async getFirstBlock ({ commit, rootState }) {
    try {
      const block = await getBlock(rootState.authentication.network.minBlockHeight);
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
  }, */
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
    } finally {
      commit('setRewardsLoaded', true);
    }
  },
  async getValidators({ state, commit, dispatch }) {
    try {
      commit('setValidatorsLoaded', false);
      const validators = await loadValidators();
      commit('setValidators', validators);
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
    } finally {
      commit('setValidatorsLoaded', true);
    }

    await dispatch('updateValidatorImages', { validators: state.validators, update: false });
  },
  async updateValidatorImages({ commit }, { validators, update = true}: { validators: Validator[], update: boolean }) {
    // get validator images for chunk
    await updateValidatorImages(validators, update, (updatedChunk) => {
      const updatedValidatorsDict = keyBy(updatedChunk, 'operatorAddress');
      // update the validators from our chunk
      const updatedValidators = validators.map((validator) => {
        const updatedValidator = updatedValidatorsDict[validator.operatorAddress];

        if (updatedValidator) {
          return updatedValidator;
        }

        return validator;
      });

      // update the store and UI
      commit('setUpdatedValidators', updatedValidators);
    });
  },
  async getProposals({ commit, getters }) {
    try {
      commit('setProposalsLoaded', false);
      const proposals = await getProposals(getters['validatorsDictionary']);

      commit('setProposals', proposals);
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
    } finally {
      commit('setProposalsLoaded', true);
    }
  },
  async getGovernanceOverview({ commit, getters }) {
    try {
      commit('setGovernanceOverviewLoaded', false);
      const governanceOverview = await getGovernanceOverview(getters['topVoters']);
      commit('setGovernanceOverview', governanceOverview);
    } catch (err) {
      /* if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting governanceOverview failed:' + err.message,
          },
          { root: true }
        );
      } */
    } finally {
      commit('setGovernanceOverviewLoaded', true);
    }
  },
  async getDepositParams({ commit }) {
    try {
      const { deposit_params: depositParams } = await getDeposit();
      commit('setDepositParams', depositParams);
    } catch (err) {
      /* if (err instanceof Error) {
        commit(
          'notifications/add',
          {
            type: 'danger',
            message: 'Getting deposit params failed:' + err.message,
          },
          { root: true }
        );
      } */
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
  async getAccountInfo(_, address: string) {
    const accountInfo = await getAccountInfo(address);

    return accountInfo;
  },
  async getCoinGeckoDetails({ rootState, commit }) {
    try {
      commit('setLoadingCoinDetails', true);
      const responseCoinDetails = await getCoinGeckoDetails(rootState.authentication.network.coinGeckoId);

      commit('setCoinDetails', responseCoinDetails.data);
    } catch (error) {
      throw error;
    } finally {
      commit('setLoadingCoinDetails', false);
    }
  },
  async signTransaction({ commit, dispatch, rootState }, data: TransactionRequest) {
    try {
      if (rootState.authentication.session && data) {
        commit('setLoadingSignTransaction', true);
        const session = rootState.authentication.session;
        const block = await dispatch('getBlock') as BlockReduced;
        const accountInfo = await dispatch('getAccountInfo', session.address) as AccountInfo;

        const { type, memo } = data;
        const HDPath = rootState.authentication.network.HDPath;

        const hashResult = await createSignBroadcast({
          messageType: type,
          message: data,
          senderAddress: session.address,
          accountInfo,
          network: rootState.authentication.network,
          signingType: session.sessionType,
          password: data.password ?? '',
          HDPath,
          memo: memo ?? '',
          feeDenom: rootState.authentication.network.stakingDenom,
          chainId: block.chainId,
          ledgerTransport: rootState.ledger.transport
        })

        const { hash } = hashResult;

        await pollTxInclusion(hash);

        dispatch('refresh').catch(err => console.error(err));

        return hash;
      }
    } catch (err) {
      throw err;
    } finally {
      commit('setLoadingSignTransaction', false);
    }
  },
}

export default actions;
