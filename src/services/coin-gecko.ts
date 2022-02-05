import { coinGeckoApi } from 'src/boot/axios';
import { CoinGeckoResponse } from 'src/models/coin-gecko';

export const getCoinGeckoDetails = (coin: string) => {
  return coinGeckoApi.get<CoinGeckoResponse>(`coins/${coin}`);
};
