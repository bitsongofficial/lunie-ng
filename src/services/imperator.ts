import { imperatorApi } from 'src/boot/axios';
import { ImperatorSymbolResponse, ImperatorToken } from 'src/models';

export const searchSymbolDetails = (denom: string) => {
  return imperatorApi.get<ImperatorSymbolResponse>('search/v1/symbol', {
    params: {
      denom,
    }
  });
};

export const searchTokenDetails = (symbol: string) => {
  return imperatorApi.get<ImperatorToken[]>(`tokens/v2/${symbol}`);
};
