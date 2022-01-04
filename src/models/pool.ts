import { Coin } from '@cosmjs/stargate';

export interface Pool {
  not_bonded_tokens: string;
  bonded_tokens: string;
}

export interface PoolResponse {
  pool: Pool;
}

export interface CommunityPoolResponse {
  pool: Coin[];
}
