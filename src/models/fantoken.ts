import { FanToken } from '@bitsongjs/sdk/build/codec/bitsong/fantoken/v1beta1/fantoken';
import { Coin } from '@bitsongjs/sdk/build/codec/cosmos/base/v1beta1/coin';
import { PaginationResponse } from './balances';

export interface FantokenResponse extends PaginationResponse {
  fantokens: FanToken[];
}

export interface IssueFantokenRequest {
  name: string;
  symbol: string;
  maxSupply: string;
  description: string;
}

export interface FantokenParams {
  issue_price: Coin;
}

export interface FantokenParamsResponse {
  params: FantokenParams;
}

export interface FanTokenWithStats extends FanToken {
  supply: Coin;
  burned?: Coin;
}

export interface FanTokenMapped extends FanToken {
  supply: string;
  burned: string;
  minted: string;
}
