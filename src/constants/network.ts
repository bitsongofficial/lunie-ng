import { NetworkConfig } from 'src/models';

// Default network
export const network: NetworkConfig = {
  id: 'bitsong-2b',
  name: 'BitSong Mainnet',
  description: 'BitSong Mainnet',
  logo: 'logo.svg',
  website: 'https://bitsong.io',
  apiURL: 'https://lcd.explorebitsong.com',
  rpcURL: 'https://rpc.explorebitsong.com',
  explorerURL: 'https://www.mintscan.io/bitsong/',
  supplyURL: 'https://supply.bitsong.io/',
  minBlockHeight: 2966151,
  stakingDenom: 'BTSG',
  coinLookup: [
    {
      viewDenom: 'BTSG',
      chainDenom: 'ubtsg',
      chainToViewConversionFactor: 1e-6,
      icon: 'currencies/bitsong.png',
    },
  ],
  addressPrefix: 'bitsong',
  validatorAddressPrefix: 'bitsongvaloper',
  validatorConsensusaddressPrefix: 'bitsongvalcons', // needed to map validators from staking queries to the validator set
  HDPath: 'm/44\'/639\'/0\'/0/0',
  coinType: 639,
  coinGeckoId: 'bitsong',
  lockUpPeriod: '3 days',
  fees: {
    default: {
      gasEstimate: 350000,
      feeOptions: [
        {
          denom: 'BTSG',
          amount: 0.001,
        },
      ],
    },
  },
  icon: 'https://assets.coingecko.com/coins/images/5041/small/logo_-_2021-01-10T210801.390.png',
  localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
};

export const networks: NetworkConfig[] = [
  network,
  {
    id: 'bitsong-2b-test',
    name: 'BitSong Testnet',
    description: 'BitSong Testnet',
    logo: 'logo.svg',
    website: 'https://bitsong.io',
    apiURL: 'https://api.testnet.bitsong.network',
    rpcURL: 'https://rpc.testnet.bitsong.network',
    supplyURL: 'https://supply.bitsong.io/',
    explorerURL: 'https://www.mintscan.io/bitsong/',
    minBlockHeight: 2966151,
    stakingDenom: 'BTSG',
    coinLookup: [
      {
        viewDenom: 'BTSG',
        chainDenom: 'ubtsg',
        chainToViewConversionFactor: 1e-6,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'bitsong',
    validatorAddressPrefix: 'bitsongvaloper',
    validatorConsensusaddressPrefix: 'bitsongvalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/639\'/0\'/0/0',
    coinType: 639,
    coinGeckoId: 'bitsong',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'BTSG',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'https://assets.coingecko.com/coins/images/5041/small/logo_-_2021-01-10T210801.390.png',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },
  {
    id: 'juno-1',
    name: 'Juno',
    description: 'Juno Mainnet',
    logo: 'logo.svg',
    website: 'https://junonetwork.io',
    apiURL: 'https://lcd-juno.itastakers.com',
    rpcURL: 'https://rpc-juno.itastakers.com',
    explorerURL: 'https://www.mintscan.io/juno/',
    supplyURL: 'https://supply.junonetwork.io/',
    minBlockHeight: 1412200,
    stakingDenom: 'JUNO',
    coinLookup: [
      {
        viewDenom: 'JUNO',
        chainDenom: 'ujuno',
        chainToViewConversionFactor: 1e-6,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'juno',
    validatorAddressPrefix: 'junovaloper',
    validatorConsensusaddressPrefix: 'junovalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/118\'/0\'/0/0',
    coinType: 118,
    coinGeckoId: 'juno-network',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'JUNO',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'https://assets.coingecko.com/coins/images/5041/small/logo_-_2021-01-10T210801.390.png',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },
  {
    id: 'osmosis-1',
    name: 'Osmosis',
    description: 'Osmosis Mainnet',
    logo: 'logo.svg',
    website: 'https://osmosis.zone',
    apiURL: 'https://lcd-osmosis.keplr.app',
    rpcURL: 'https://rpc-osmosis.itastakers.com',
    explorerURL: 'https://www.mintscan.io/osmosis/',
    supplyURL: null,
    minBlockHeight: 2742000,
    stakingDenom: 'OSMO',
    coinLookup: [
      {
        viewDenom: 'OSMO',
        chainDenom: 'uosmo',
        chainToViewConversionFactor: 1e-6,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'osmo',
    validatorAddressPrefix: 'osmovaloper',
    validatorConsensusaddressPrefix: 'osmovalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/118\'/0\'/0/0',
    coinType: 118,
    coinGeckoId: 'osmosis',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'OSMO',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'https://assets.coingecko.com/coins/images/5041/small/logo_-_2021-01-10T210801.390.png',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },
  {
    id: 'cosmoshub-4',
    name: 'Cosmos',
    description: 'Cosmos Mainnet',
    logo: 'logo.svg',
    website: 'https://bitsong.io',
    apiURL: 'https://lcd-cosmoshub.keplr.app',
    rpcURL: 'https://rpc-cosmoshub.keplr.app',
    explorerURL: 'https://www.mintscan.io/cosmos/',
    supplyURL: null,
    minBlockHeight: 9054000,
    stakingDenom: 'ATOM',
    coinLookup: [
      {
        viewDenom: 'ATOM',
        chainDenom: 'uatom',
        chainToViewConversionFactor: 1e-6,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'cosmos',
    validatorAddressPrefix: 'cosmosvaloper',
    validatorConsensusaddressPrefix: 'cosmosvalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/118\'/0\'/0/0',
    coinType: 118,
    coinGeckoId: 'cosmos',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'ATOM',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'https://assets.coingecko.com/coins/images/5041/small/logo_-_2021-01-10T210801.390.png',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },
  {
    id: 'chihuahua-1',
    name: 'Chihuahua',
    description: 'Chihuahua Mainnet',
    logo: 'logo.svg',
    website: 'https://chihuahua.wtf',
    apiURL: 'https://api.chihuahua.wtf',
    rpcURL: 'https://rpc.chihuahua.wtf',
    explorerURL: 'https://www.mintscan.io/chihuahua/',
    minBlockHeight: 1,
    supplyURL: null,
    stakingDenom: 'HUAHUA',
    coinLookup: [
      {
        viewDenom: 'HUAHUA',
        chainDenom: 'uhuahua',
        chainToViewConversionFactor: 1e-6,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'chihuahua',
    validatorAddressPrefix: 'chihuahuavaloper',
    validatorConsensusaddressPrefix: 'chihuahuavalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/118\'/0\'/0/0',
    coinType: 118,
    coinGeckoId: 'chihuahua-token',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'HUAHUA',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'https://assets.coingecko.com/coins/images/22485/small/logo_transparent_notext.png',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },{
    id: 'likecoin-mainnet-2',
    name: 'LikeCoin',
    description: 'LikeCoin Mainnet',
    logo: 'logo.svg',
    website: 'https://like.co',
    apiURL: 'https://mainnet-node.like.co',
    rpcURL: 'https://mainnet-node.like.co:443/rpc/',
    explorerURL: 'https://likecoin.bigdipper.live/',
    supplyURL: null,
    minBlockHeight: 2167000,
    stakingDenom: 'LIKE',
    coinLookup: [
      {
        viewDenom: 'LIKE',
        chainDenom: 'nanolike',
        chainToViewConversionFactor: 1e-9,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'cosmos',
    validatorAddressPrefix: 'cosmosvaloper',
    validatorConsensusaddressPrefix: 'cosmosvalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/118\'/0\'/0/0',
    coinType: 118,
    coinGeckoId: 'cosmos',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'LIKE',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'https://assets.coingecko.com/coins/images/10212/small/likecoin.png',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  }
];
