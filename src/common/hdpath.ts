import { Slip10RawIndex } from '@cosmjs/crypto';

/* required conversion of HD path for cosmjs */
export const getHDPath = (hdPathString: string) => {
  return hdPathString
    .split('/')
    .slice(1)
    .map((value) => {
      const length = value.length;

      if (value[length - 1] === '\'') {
        return Slip10RawIndex.hardened(Number(value.slice(0, length - 1)));
      }

      return Slip10RawIndex.normal(Number(value.slice(0, length)))
    });
}
