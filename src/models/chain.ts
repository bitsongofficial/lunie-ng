export enum ChainPrefix {
  BITSONG = 'bitsong',
  OSMO = 'osmo',
  COSMOS = 'cosmos',
  JUNO = 'juno'
}

export interface ChainCoin {
  amount: number;
  denom: string;
}

export interface ChainFee {
  coins: ChainCoin[];
  gas: string;
}

export interface ChainIBC {
  channel: string;
  ibcDenom: string;
}

export interface Chain {
  name: string;
  mintscan: string;
  prefix: ChainPrefix | string;
  chainId: string;
  logo: string;
  btsgDenom: string;
  rpc: string;
  fee: ChainFee;
  ibc: { [key: ChainPrefix | string]: ChainIBC };
}
