import { Chain, ChainPrefix } from 'src/models';
import { ChainInfo } from '@keplr-wallet/types';

export const chains: Chain[] = [
  {
    name: 'BitSong',
    mintscan: 'bitsong',
    prefix: ChainPrefix.BITSONG,
    chainId: 'bitsong-2b',
    logo: 'bitsong.svg',
    btsgDenom: 'ubtsg',
    rpc: 'https://rpc.explorebitsong.com',
    fee: {
      coins: [
        {
          amount: 0,
          denom: 'ubtsg'
        }
      ],
      gas: '180000'
    },
    ibc: {
      [ChainPrefix.OSMO]: {
        channel: 'channel-0',
        ibcDenom: 'ubtsg'
      },
      [ChainPrefix.COSMOS]: {
        channel: 'channel-1',
        ibcDenom: 'ubtsg'
      },
      [ChainPrefix.JUNO]: {
        channel: 'channel-5',
        ibcDenom: 'ubtsg'
      },
    }
  },
  {
    name: 'Osmosis',
    mintscan: 'osmosis',
    prefix: ChainPrefix.OSMO,
    chainId: 'osmosis-1',
    logo: 'osmosis.svg',
    btsgDenom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
    rpc: 'https://rpc-osmosis.itastakers.com',
    fee: {
      coins: [
        {
          amount: 0,
          denom: 'osmo'
        }
      ],
      gas: '180000'
    },
    ibc: {
      [ChainPrefix.BITSONG]: {
        channel: 'channel-73',
        ibcDenom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452'
      },
    }
  },
  {
    name: 'Juno',
    mintscan: 'juno',
    prefix: ChainPrefix.JUNO,
    chainId: 'juno-1',
    logo: 'juno.svg',
    btsgDenom: 'ibc/008BFD000A10BCE5F0D4DD819AE1C1EC2942396062DABDD6AE64A655ABC7085B',
    rpc: 'https://rpc-juno.itastakers.com',
    fee: {
      coins: [
        {
          amount: 0,
          denom: 'ujuno'
        }
      ],
      gas: '180000'
    },
    ibc: {
      [ChainPrefix.BITSONG]: {
        channel: 'channel-17',
        ibcDenom: 'ibc/008BFD000A10BCE5F0D4DD819AE1C1EC2942396062DABDD6AE64A655ABC7085B'
      },
    }
  },
  {
    name: 'Cosmos',
    mintscan: 'cosmos',
    prefix: ChainPrefix.COSMOS,
    chainId: 'cosmoshub-4',
    logo: 'cosmos.svg',
    btsgDenom: 'ibc/E7D5E9D0E9BF8B7354929A817DD28D4D017E745F638954764AA88522A7A409EC',
    rpc: 'https://cosmoshub-4.technofractal.com:443',
    fee: {
      coins: [
        {
          amount: 0,
          denom: 'atom'
        }
      ],
      gas: '180000'
    },
    ibc: {
      [ChainPrefix.BITSONG]: {
        channel: 'channel-229',
        ibcDenom: 'ibc/E7D5E9D0E9BF8B7354929A817DD28D4D017E745F638954764AA88522A7A409EC'
      },
    }
  },
];

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
