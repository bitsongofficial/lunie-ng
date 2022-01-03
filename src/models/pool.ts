export interface Pool {
  not_bonded_tokens: string;
  bonded_tokens: string;
}

export interface PoolResponse {
  pool: Pool;
}
