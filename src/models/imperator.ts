export interface ImperatorSymbolResponse {
  symbol: string;
}

export interface ImperatorToken {
  price: number;
  denom: string;
  symbol: string;
  liquidity: number;
  volume_24h: number;
  name: string;
}
