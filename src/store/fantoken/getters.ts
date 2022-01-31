import { BigNumber } from 'bignumber.js';
import { getCoinLookup } from 'src/common/network';
import { shortDecimals } from 'src/common/numbers';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { FantokenStateInterface } from './state';

const getters: GetterTree<FantokenStateInterface, StateInterface> = {
  fantokenByOwner({ fantokens }, _getters, { authentication }) {
    const coinLookup = getCoinLookup(authentication.network.stakingDenom, 'viewDenom');

    if (coinLookup) {
      return fantokens
      .filter(fantoken => fantoken.owner === authentication.session?.address)
      .map(fantoken => {
        const burned = new BigNumber(fantoken.burned ? fantoken.burned.amount : '0')
          .multipliedBy(coinLookup.chainToViewConversionFactor);

        const supply = new BigNumber(fantoken.supply.amount)
          .multipliedBy(coinLookup.chainToViewConversionFactor);

        const minted = supply.plus(burned);

        return {
          ...fantoken,
          maxSupply: shortDecimals(
            new BigNumber(fantoken.maxSupply)
            .multipliedBy(coinLookup.chainToViewConversionFactor)
            .toFixed()
          ),
          supply: shortDecimals(supply.toFixed()),
          burned: shortDecimals(burned.toFixed()),
          minted: shortDecimals(minted.toFixed()),
        }
      });
    }

    return [];
  },
  fantokenLoading({ loading }, _getters, { data }) {
    return loading || !data.balancesLoaded;
  },
  issueFee({ params }, _getters, { authentication }) {
    if (params) {
      const coinLookup = getCoinLookup(authentication.network.stakingDenom, 'viewDenom');

      if (coinLookup) {
        return new BigNumber(params.issue_price.amount)
          .multipliedBy(coinLookup.chainToViewConversionFactor)
          .toFixed();
      }
    }

    return '0';
  }
}

export default getters;
