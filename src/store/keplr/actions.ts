import { ActionTree } from 'vuex'
import { lunieCoinToKeplrCoin } from 'src/common/network';
import { StateInterface } from '../index'
import { KeplrStateInterface } from './state'
import { AppCurrency } from '@keplr-wallet/types';
import { BlockReduced } from 'src/models';

const actions: ActionTree<KeplrStateInterface, StateInterface> = {
  async init ({ commit, dispatch, rootState }, trys: number) {
    commit('setError', undefined);
    commit('setLoading', true);

    // sometimes the page loads quicker the keplr is available
    // so we try again for a couple of times but give up at somepoint
    if (!window.keplr && trys < 3) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch('init', trys + 1).catch(error => console.error(error));
    }
    if (window.keplr && window.keplr.experimentalSuggestChain) {
      const block = await dispatch('data/getBlock', undefined, { root: true }) as BlockReduced;

      try {
        // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
        // cosmoshub-3 is integrated to Keplr so the code should return without errors.
        // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
        // If the user approves, the chain will be added to the user's Keplr extension.
        // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
        // If the same chain id is already registered, it will resolve and not require the user interactions.
        const stakeCurrency = lunieCoinToKeplrCoin(rootState.authentication.network.stakingDenom);

        const currencies: AppCurrency[] = [];

        const feeCurrencies: AppCurrency[] = [];

        rootState.authentication.network.coinLookup.forEach(({ viewDenom }) => {
          const coin = lunieCoinToKeplrCoin(viewDenom);

          if (coin) {
            currencies.push(coin);
            feeCurrencies.push(coin);
          }
        });

        if (stakeCurrency) {
          await window.keplr.experimentalSuggestChain({
            // Chain-id of the Cosmos SDK chain.
            chainId: block.chainId,
            // The name of the chain to be displayed to the user.
            chainName: rootState.authentication.network.name,
            // RPC endpoint of the chain.
            rpc: rootState.authentication.network.rpcURL,
            // REST endpoint of the chain.
            rest: rootState.authentication.network.apiURL,
            // Staking coin information
            stakeCurrency,
            // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
            // The 'stake' button in Keplr extension will link to the webpage.
            // walletUrlForStaking: "",
            // The BIP44 path.
            bip44: {
              // You can only set the coin type of BIP44.
              // 'Purpose' is fixed to 44.
              coinType: rootState.authentication.network.coinType,
            },
            // Bech32 configuration to show the address to user.
            // This field is the interface of
            // {
            //   bech32PrefixAccAddr: string;
            //   bech32PrefixAccPub: string;
            //   bech32PrefixValAddr: string;
            //   bech32PrefixValPub: string;
            //   bech32PrefixConsAddr: string;
            //   bech32PrefixConsPub: string;
            // }
            bech32Config: {
              bech32PrefixAccAddr: rootState.authentication.network.addressPrefix,
              bech32PrefixAccPub: rootState.authentication.network.addressPrefix + 'pub',
              bech32PrefixValAddr: rootState.authentication.network.addressPrefix + 'valoper',
              bech32PrefixValPub: rootState.authentication.network.addressPrefix + 'valoperpub',
              bech32PrefixConsAddr: rootState.authentication.network.addressPrefix + 'valcons',
              bech32PrefixConsPub: rootState.authentication.network.addressPrefix + 'valconspub',
            },
            // List of all coin/tokens used in this chain.
            currencies,
            // List of coin/tokens used as a fee token in this chain.
            feeCurrencies,
            // (Optional) The number of the coin type.
            // This field is only used to fetch the address from ENS.
            // Ideally, it is recommended to be the same with BIP44 path's coin type.
            // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
            // So, this is separated to support such chains.
            coinType: rootState.authentication.network.coinType,
            // (Optional) This is used to set the fee of the transaction.
            // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
            // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
            // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
            gasPriceStep: {
              low: 0.01,
              average: 0.025,
              high: 0.04,
            },
            features: ['stargate', 'ibc-transfer'],
          });
          await window.keplr.enable(block.chainId);

          const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(block.chainId);

          // You can get the address/public keys by `getAccounts` method.
          // It can return the array of address/public key.
          // But, currently, Keplr extension manages only one address/public key pair.
          // XXX: This line is needed to set the sender address for SigningCosmosClient.
          const accounts = await offlineSigner.getAccounts();

          commit('setAccounts', accounts);

          commit('setInitialized');
        }
      } catch (error) {
        commit('setError', (error as Error).message);
        throw error;
      } finally {
        commit('setLoading', false);
      }
    }
  }
}

export default actions
