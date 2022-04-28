import { NetworkConfig } from 'src/models';

// Default network
export const network: NetworkConfig = {
  id: 'bigbang-test-4',
  name: 'BitSong Testnet',
  description: 'BitSong Testnet',
  logo: 'logo.svg',
  website: 'https://bitsong.io',
  apiURL: 'https://api.testnet.bitsong.network',
  faucetURL: 'https://faucet.testnet.bitsong.network',
  rpcURL: 'https://rpc.testnet.bitsong.network',
  explorerURL: 'https://www.mintscan.io/bitsong/',
  minBlockHeight: 1,
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
];
