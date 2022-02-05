import { coinGeckoApi } from 'src/boot/axios';
import { CoinGeckoResponse } from 'src/models';

export const getCoinGeckoDetails = (coin: string) => {
  return coinGeckoApi.get<CoinGeckoResponse>(`coins/${coin}`);
};
