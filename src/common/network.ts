/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AppCurrency } from '@keplr-wallet/types';
import { BigNumber } from 'bignumber.js';
import Store from 'src/store';

export const getCoinLookup = (denom: string, coinLookupDenomType = 'chainDenom') => {
  return Store.state.authentication.network.coinLookup.find(
    // @ts-ignore
    (coin) => coin[coinLookupDenomType] === denom
  );
}

export const lunieCoinToKeplrCoin = (denom: string): AppCurrency | undefined =>  {
  const coinLookup = Store.state.authentication.network.coinLookup.find(
    (coin) => coin.viewDenom === denom
  );

  if (coinLookup) {
    const coinDecimals = new BigNumber(coinLookup.chainToViewConversionFactor).toFixed();
    const decimals = coinDecimals.split('.')

    return {
      // Coin denomination to be displayed to the user.
      coinDenom: coinLookup.viewDenom,
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: coinLookup.chainDenom,
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: decimals.length > 1 ? coinDecimals.split('.')[1].length : 0,
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      coinGeckoId: Store.state.authentication.network.coinGeckoId,
    }
  }
}
