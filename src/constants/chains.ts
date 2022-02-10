import { ChainInfo } from '@keplr-wallet/types';

export const suggestChains: ChainInfo[] = [
  {
    chainId: 'juno-1',
    chainName: 'Juno',
    rpc: 'https://rpc-juno.itastakers.com',
    rest: 'https://lcd-juno.itastakers.com',
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'juno',
      bech32PrefixAccPub: 'juno' + 'pub',
      bech32PrefixValAddr: 'juno' + 'valoper',
      bech32PrefixValPub: 'juno' + 'valoperpub',
      bech32PrefixConsAddr: 'juno' + 'valcons',
      bech32PrefixConsPub: 'juno' + 'valconspub',
    },
    currencies: [
      {
        coinDenom: 'JUNO',
        coinMinimalDenom: 'ujuno',
        coinDecimals: 6,
        coinGeckoId: 'juno-network',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'JUNO',
        coinMinimalDenom: 'ujuno',
        coinDecimals: 6,
        coinGeckoId: 'juno-network',
      },
    ],
    stakeCurrency: {
      coinDenom: 'JUNO',
      coinMinimalDenom: 'ujuno',
      coinDecimals: 6,
      coinGeckoId: 'juno-network',
    },
    coinType: 118,
    features: ['stargate', 'ibc-transfer'],
  },
  {
    chainId: 'bitsong-2b',
    chainName: 'BitSong',
    rpc: 'https://rpc.explorebitsong.com',
    rest: 'https://lcd.explorebitsong.com',
    bip44: {
      coinType: 639,
    },
    bech32Config: {
      bech32PrefixAccAddr: 'bitsong',
      bech32PrefixAccPub: 'bitsong' + 'pub',
      bech32PrefixValAddr: 'bitsong' + 'valoper',
      bech32PrefixValPub: 'bitsong' + 'valoperpub',
      bech32PrefixConsAddr: 'bitsong' + 'valcons',
      bech32PrefixConsPub: 'bitsong' + 'valconspub',
    },
    currencies: [
      {
        coinDenom: 'BTSG',
        coinMinimalDenom: 'ubtsg',
        coinDecimals: 6,
        coinGeckoId: 'bitsong',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'BTSG',
        coinMinimalDenom: 'ubtsg',
        coinDecimals: 6,
        coinGeckoId: 'bitsong',
      },
    ],
    stakeCurrency: {
      coinDenom: 'BTSG',
      coinMinimalDenom: 'ubtsg',
      coinDecimals: 6,
      coinGeckoId: 'bitsong',
    },
    coinType: 639,
    features: ['stargate', 'ibc-transfer'],
  }
];
