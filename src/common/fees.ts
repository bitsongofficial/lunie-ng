import Store from 'src/store';

export const getNetworkFee = (transactionType?: string) => {
  const fees = Store.state.authentication.network.fees;

  if (transactionType) {
    const fee = fees[transactionType];

    if (fee) {
      return fee;
    }
  }

  return fees.default;
}
