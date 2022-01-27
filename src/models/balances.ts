import { Coin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';

export interface Balance {
  id: string;
  type: string;
  total: string | number | BigNumber;
  denom: string;
  available: string | number | BigNumber;
  staked: number;
  sourceChain: string | undefined;
  name?: string;
  display?: string;
  symbol?: string;
}

export interface Pagination {
  next_key: string | null;
  total: string;
}

export interface PaginationResponse {
  [key: string]: unknown;
  pagination: Pagination;
}

export interface BalanceResponse extends PaginationResponse {
  balances: Coin[];
}

export interface SplittedDecimals {
  left?: string;
  right?: string;
}
