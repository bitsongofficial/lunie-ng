import { network } from 'src/constants';

export const getNetworkFee = (transactionType?: string) => {
  const fees = network.fees;

  if (transactionType) {
    const fee = fees[transactionType];

    if (fee) {
      return fee;
    }
  }

  return fees.default;
}
