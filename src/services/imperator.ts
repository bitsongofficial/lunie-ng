import { imperatorApi } from 'src/boot/axios';
import { ImperatorSymbolResponse } from 'src/models';

export const searchSymbolDetails = (denom: string) => {
  return imperatorApi.get<ImperatorSymbolResponse>('search/v1/symbol', {
    params: {
      denom,
    }
  });
};
