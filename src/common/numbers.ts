import { BigNumber } from 'bignumber.js';

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

export const setDecimalLength = (value: number, length: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return null;
  }

  // rounding up the last decimal
  const roundedValue = Math.round(value * Math.pow(10, length)) / Math.pow(10, length);

  return new Intl.NumberFormat(language, {
    minimumFractionDigits: length > 3 ? length : 0,
  }).format(roundedValue)
}

function shortDecimals(value: number) {
  return setDecimalLength(value, 3)
}

export const bigFigureOrShortDecimals = (number: string | number) => {
  // here we check how many positive digits the number has to see how we should format it
  const castNumber = Number(number);

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
