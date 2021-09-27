export default {
  id: 'bitsong-testnet-6',
  name: 'BitSong Testnet 6',
  description: 'BitSong testnet 6',
  logo: `logo.svg`,
  website: 'https://bitsong.io',
  // apiURL: 'http://localhost:8010/proxy',
  apiURL: 'https://lcd.testnet.bitsong.network',
  rpcURL: 'https://rpc.testnet.bitsong.network',
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
  coinType: 639,
  coinGeckoId: 'bitsong',
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
