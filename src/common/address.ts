import { bech32 } from 'bech32';
import { Validator } from 'src/models';
import { Bech32 } from '@cosmjs/encoding';
import { network } from 'src/constants';

export const isValidAddress = (address: string, requiredPrefix: string = network.addressPrefix): boolean => {
  try {
    const { prefix, data } = Bech32.decode(address);

    console.log(prefix);

    if (prefix !== requiredPrefix) {
      return false;
    }

    return data.length === 20;
  } catch {
    return false;
  }
}

export const hexToValidatorAddress = (address: string, validatorPrefix: string) => {
  const words = bech32.toWords(Buffer.from(address, 'hex'));

  return bech32.encode(validatorPrefix, words);
}
/*
export const pubkeyToAddress = (cosmosValConsPub: string, validatorConsensusBech32Prefix: string) => {
  const words = bech32.decode(cosmosValConsPub).words;

  // publickey is prefixed somehow (probably amino)
  const publicKey = Buffer.from(
    Buffer.from(bech32.fromWords(words)).toString('hex').substr(10),
    'hex'
  );

  // the address is the first 20 bytes of the sha256 hash of the publickey
  const hexAddress = createHash('sha256')
    .update(publicKey)
    .digest()
    .toString('hex')
    .substr(0, 40);

  return hexToValidatorAddress(hexAddress, validatorConsensusBech32Prefix);
} */

export const formatAddress = (address: string | undefined, length = 4) => {
  if (!address) {
    return 'Address Not Found';
  }

  return `${address.split('1')[0]}…${address.slice(-1 * length)}`;
}

export const decodeB32 = (value: string) => {
  const words = bech32.decode(value);

  return Buffer.from(bech32.fromWords(words.words)).toString('hex');
}

/* export const encodeB32 = (value: ArrayBuffer | SharedArrayBuffer, prefix = 'cosmos1', type = 'hex') => {
  const words = bech32.toWords(Buffer.from(value, type));

  return bech32.encode(prefix, words);
} */

export const validatorEntry = (validator: Validator) => {
  return `${validator.name} - ${formatAddress(validator.operatorAddress, 20)}`
}
