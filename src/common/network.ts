import { network } from 'src/constants';

export const getCoinLookup = (denom: string) => {
  return network.coinLookup.find(
    (coin) => coin.chainDenom === denom
  )
}
