import { Coin } from '@cosmjs/stargate';

export interface Pagination {
  next_key: string | null;
  total: string;
}

export interface PaginationResponse {
  pagination: Pagination;
}

export interface BalanceResponse extends PaginationResponse {
  balances: Coin[];
}
