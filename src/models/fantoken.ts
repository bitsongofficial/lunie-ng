import { FanToken } from '@bitsongjs/sdk/build/codec/fantoken/fantoken';
import { PaginationResponse } from './balances';

export interface FantokenResponse extends PaginationResponse {
  fantokens: FanToken[];
}
