import { Coin } from '@cosmjs/stargate';
import { PaginationResponse } from './balances';

export interface SupplyResponse {
  circulatingSupply: string;
  communityPool: string;
  denom: string;
  chainSupply: string;
  ethSupply: string;
  totalSupply: string;
}

export interface BankSupplyResponse extends PaginationResponse {
  supply: Coin[];
}

export interface BankSupplyDenomResponse extends PaginationResponse {
  amount: Coin;
}
