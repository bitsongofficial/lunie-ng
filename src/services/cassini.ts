import { cassiniApi } from 'src/boot/axios';
import { CassiniResponse, CassiniTx } from 'src/models';

export const getCassiniTxs = (from: string) => {
  return cassiniApi.get<CassiniResponse<CassiniTx[]>>(`ethereum/from/${from}`);
};
