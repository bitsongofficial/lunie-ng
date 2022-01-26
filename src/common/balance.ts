import { Balance } from 'src/models';
import { getStakingCoinViewAmount } from 'src/common/cosmos-reducer';
import { shortDecimals } from 'src/common/numbers';
import { BigNumber } from 'bignumber.js';

export const mapBalance = (balance: Balance, stakingDenom: string): Balance => {
  if (balance.denom === stakingDenom) {
    return ({
      ...balance,
    });
  }

  const total = getStakingCoinViewAmount(new BigNumber(balance.total).toString());
  const available = getStakingCoinViewAmount(new BigNumber(balance.available).toString());

  return ({
    ...balance,
    total: shortDecimals(total) ?? '',
    available: shortDecimals(available) ?? '',
  });
}
