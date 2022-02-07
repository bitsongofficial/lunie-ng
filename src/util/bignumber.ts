import { BigNumber } from 'bignumber.js';

export const toDecimal = (amount: string, factor = 1000000): string => {
  const number = new BigNumber(amount);
  return number.div(factor).toFixed(6);
}

export const toUbtsg = (amount: string, factor = 1000000): string => {
  const number = new BigNumber(amount);
  return number.multipliedBy(factor).toFixed(0);
}

export const compareBalance = (amount: string, compare: string): boolean => {
  const number = new BigNumber(amount);
  const compareNumber = new BigNumber(compare);

  return number.lte(compareNumber);
}

export const isNegative = (amount: string): boolean => {
  const number = new BigNumber(amount);

  return number.isNegative();
}

export const isNaN = (amount: string): boolean => {
  const number = new BigNumber(amount);

  return number.isNaN();
}

export const gtnZero = (amount: string): boolean => {
  const number = new BigNumber(amount);

  return number.gt(0);
}
