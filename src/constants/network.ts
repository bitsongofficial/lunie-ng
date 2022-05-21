import { Dictionary } from 'lodash';
import { NetworkConfig } from 'src/models';

// Default network
export const network: NetworkConfig = {
  id: 'bitsong-2b',
  name: 'BitSong',
  description: 'BitSong',
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
    ibcTransfer: {
      gasEstimate: 180000,
      feeOptions: [
        {
          denom: 'ubtsg',
          amount: 0,
        },
      ],
    },
  },
  icon: 'coins/btsg.svg',
  localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
};

export const networks: NetworkConfig[] = [
  network,
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
    minBlockHeight: 3062001,
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
      ibcTransfer: {
        gasEstimate: 180000,
        feeOptions: [
          {
            denom: 'ujuno',
            amount: 0,
          },
        ],
      },
    },
    icon: 'coins/juno.svg',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },
  {
    id: 'osmosis-1',
    name: 'Osmosis',
    description: 'Osmosis Mainnet',
    logo: 'logo.svg',
    website: 'https://osmosis.zone',
    apiURL: 'https://lcd.osmosis.bas.network',
    rpcURL: 'https://rpc.osmosis.bas.network',
    explorerURL: 'https://www.mintscan.io/osmosis/',
    supplyURL: null,
    minBlockHeight: 4421953,
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
      ibcTransfer: {
        gasEstimate: 180000,
        feeOptions: [
          {
            denom: 'osmo',
            amount: 0,
          },
        ],
      },
    },
    icon: 'coins/osmosis.svg',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },
  {
    id: 'cosmoshub-4',
    name: 'Cosmos',
    description: 'Cosmos Mainnet',
    logo: 'logo.svg',
    website: 'https://cosmos.network',
    apiURL: 'https://lcd.cosmos.bas.network',
    rpcURL: 'https://rpc.cosmos.bas.network/',
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
      ibcTransfer: {
        gasEstimate: 180000,
        feeOptions: [
          {
            denom: 'atom',
            amount: 0,
          },
        ],
      },
    },
    icon: 'coins/cosmos.svg',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },
  {
    id: 'desmos-mainnet',
    name: 'Desmos',
    description: 'Desmos Mainnet',
    logo: 'logo.svg',
    website: 'https://desmos.network',
    apiURL: 'https://api.mainnet.desmos.network',
    rpcURL: 'https://rpc.mainnet.desmos.network',
    explorerURL: 'https://www.mintscan.io/desmos/',
    minBlockHeight: 3570001,
    supplyURL: null,
    stakingDenom: 'DSM',
    coinLookup: [
      {
        viewDenom: 'DSM',
        chainDenom: 'udsm',
        chainToViewConversionFactor: 1e-6,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'desmos',
    validatorAddressPrefix: 'desmosvaloper',
    validatorConsensusaddressPrefix: 'desmosvalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/852\'/0\'/0/0',
    coinType: 852,
    coinGeckoId: 'desmos',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'DSM',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'coins/dsm.png',
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
    icon: 'coins/huahua.png',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },{
    id: 'cerberus-chain-1',
    name: 'Cerberus',
    description: 'Cerberus Mainnet',
    logo: 'logo.svg',
    website: 'https://cerberus.zone/',
    apiURL: 'https://api.cerberus.zone:1317',
    rpcURL: 'https://rpc.cerberus.zone:26657',
    explorerURL: 'https://www.mintscan.io/cerberus/',
    minBlockHeight: 1,
    supplyURL: null,
    stakingDenom: 'CRBRUS',
    coinLookup: [
      {
        viewDenom: 'CRBRUS',
        chainDenom: 'ucrbrus',
        chainToViewConversionFactor: 1e-6,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'cerberus',
    validatorAddressPrefix: 'cerberusvaloper',
    validatorConsensusaddressPrefix: 'cerberusvalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/118\'/0\'/0/0',
    coinType: 118,
    coinGeckoId: 'cerberus-2',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'CRBRUS',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'coins/crbrus.png',
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
    coinGeckoId: 'likecoin',
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
    icon: 'coins/likecoin.svg',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  },{
    id: 'stargaze-1',
    name: 'Stargaze',
    description: 'Stargaze Mainnet',
    logo: 'logo.svg',
    website: 'https://www.stargaze.zone',
    apiURL: 'https://api.stargaze.ezstaking.io',
    rpcURL: 'https://rpc.stargaze.ezstaking.io/',
    explorerURL: 'https://www.mintscan.io/stargaze/',
    supplyURL: null,
    minBlockHeight: 1,
    stakingDenom: 'STARS',
    coinLookup: [
      {
        viewDenom: 'STARS',
        chainDenom: 'ustars',
        chainToViewConversionFactor: 1e-6,
        icon: 'currencies/bitsong.png',
      },
    ],
    addressPrefix: 'stars',
    validatorAddressPrefix: 'starsvaloper',
    validatorConsensusaddressPrefix: 'starsvalcons', // needed to map validators from staking queries to the validator set
    HDPath: 'm/44\'/118\'/0\'/0/0',
    coinType: 118,
    coinGeckoId: 'stargaze',
    lockUpPeriod: '3 days',
    fees: {
      default: {
        gasEstimate: 350000,
        feeOptions: [
          {
            denom: 'STARS',
            amount: 0.001,
          },
        ],
      },
    },
    icon: 'coins/stars.png',
    localSigning: false, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
  }
];

export const DefaultGasPriceStep: Dictionary<number> = {
  low: 0.01,
  average: 0.025,
  high: 0.04,
};

export enum FeeType {
  LOW = 'low',
  AVERAGE = 'average',
  HIGH = 'high'
}
