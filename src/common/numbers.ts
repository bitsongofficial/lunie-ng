import { BigNumber } from 'bignumber.js';
import { SplittedDecimals, CoinLookUp } from 'src/models';
import { getStakingCoinViewAmount } from './cosmos-reducer';
import { Coin as StargateCoin } from '@cosmjs/stargate';

const language = 'en';

export const bigFigure = (number = 0) => {
  let formatted = Math.round(number * 100) / 100;

  let suffix = ''
  if (Math.abs(Number(formatted)) >= 1e12) {
    formatted = Number(formatted) / 1e12;
    suffix = 'T';
  } else if (Math.abs(Number(formatted)) >= 1e9) {
    formatted = Number(formatted) / 1e9;
    suffix = 'B';
  } else if (Math.abs(Number(formatted)) >= 1e6) {
    formatted = Number(formatted) / 1e6;
    suffix = 'M';
  }

  return (
    new Intl.NumberFormat(language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(formatted) + ` ${suffix}`
  );
}

export const setDecimalLength = (value: string | number | BigNumber, length: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return null;
  }

  const valueParsed = Number(value);

  // rounding up the last decimal
  const roundedValue = Math.round(valueParsed * Math.pow(10, length)) / Math.pow(10, length);

  return new Intl.NumberFormat(language, {
    minimumFractionDigits: length > 3 ? length : 0,
  }).format(roundedValue)
}

export const shortDecimals = (value: string | number | BigNumber) => {
  return setDecimalLength(value, 3)
}

export const bigFigureOrShortDecimals = (number: string | number | BigNumber) => {
  // here we check how many positive digits the number has to see how we should format it
  const castNumber = new BigNumber(number).toNumber();

  if (Math.abs(castNumber) < 1e6) {
    return shortDecimals(castNumber);
  } else {
    return bigFigure(castNumber);
  }
}

export const percentage = (x: string | number | BigNumber, total: BigNumber) => {
  // percentage output should always be a number between 0 and 1
  return total.toNumber() > 0 ? new BigNumber(x).div(total).toNumber().toFixed(4) : 0;
}

export const percent = (numberRaw: number | string = 0) => {
  const number = Number(numberRaw);

  return (
    new Intl.NumberFormat(language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.round(number * 10000) / 100) + '%'
  );
}

export const bigFigureOrPercent = (number: string | number | BigNumber) => {
  // once again, the same logic
  const numberParse = Number(number);

  if (Math.abs(numberParse) < 1e4) {
    return percent(numberParse);
  } else {
    return bigFigure(numberParse * 100).toString().concat(' %');
  }
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

export const getAPR = (supply: string, inflation: string, bondedTokens: string) => {
  const supplyNumber = new BigNumber(supply);
  const inflationNumber = new BigNumber(inflation);
  const bondedTokensNumber = new BigNumber(getStakingCoinViewAmount(bondedTokens));

  return (supplyNumber.multipliedBy(inflationNumber)).div(bondedTokensNumber);
}

export const splitDecimals = (value: string): SplittedDecimals | null => {
  const splitted = value.split('.');

  if (splitted.length === 0) {
    return null;
  }

  return {
    left: splitted.shift(),
    right: splitted.pop()
  };
}

export function Coin({ amount, denom }: StargateCoin, coinLookup: CoinLookUp[]) {
  const lookup = coinLookup.find(({ viewDenom }) => viewDenom === denom);

  if (lookup) {
    return {
      amount: new BigNumber(amount)
        .dividedBy(lookup.chainToViewConversionFactor)
        .toFixed(),
      denom: lookup.chainDenom,
    };
  } else {
    return {
      amount: new BigNumber(amount)
        .dividedBy('1e-6')
        .toFixed(),
      denom
    };
  }
}
