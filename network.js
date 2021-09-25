export default {
  id: 'bitsong-2-devnet-2',
  name: 'BitSong Devnet',
  description: 'BitSong devnet test',
  logo: `logo.svg`,
  website: 'https://cosmos.network',
  // apiURL: 'http://localhost:8010/proxy',
  apiURL: 'https://lcd.devnet.bitsong.network',
  rpcURL: 'https://rpc.devnet.bitsong.network',
  minBlockHeight: 2, // actually 5200791, but it has the wrong block time.
  stakingDenom: 'BTSG',
  coinLookup: [
    {
      viewDenom: 'BTSG',
      chainDenom: 'ubtsg',
      chainToViewConversionFactor: 1e-6,
      icon: `currencies/bitsong.png`,
    },
  ],
  addressPrefix: 'bitsong',
  validatorAddressPrefix: 'bitsongvaloper',
  validatorConsensusaddressPrefix: 'bitsongvalcons', // needed to map validators from staking queries to the validator set
  HDPath: `m/44'/639'/0'/0/0`,
  lockUpPeriod: `3 days`,
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
  icon: `https://assets.coingecko.com/coins/images/5041/small/logo_-_2021-01-10T210801.390.png`,
  localSigning: true, // this is only to be used as a developer tool - never deployed in production or for mainnet chains
}
