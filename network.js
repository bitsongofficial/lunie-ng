export default {
  // id: 'bitsong-2b',
  id: 'localnet',
  name: 'BitSong Localnet',
  description: 'BitSong Localnet',
  logo: `logo.svg`,
  website: 'https://bitsong.io',
  // apiURL: 'http://localhost:8010/proxy',
  // apiURL: 'https://lcd.explorebitsong.com',
  // rpcURL: 'https://rpc.explorebitsong.com',
  apiURL: 'http://localhost:1317',
  rpcURL: 'http://localhost:26657',
  explorerURL: 'https://bitsong.bigdipper.live/',
  minBlockHeight: 2966151,
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
