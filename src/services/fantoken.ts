import { queryAutoPaginate } from './cosmos';
import { FanToken } from '@bitsongjs/sdk/build/codec/fantoken/fantoken';

export const getFantokens = async (): Promise<FanToken[]> => {
  try {
    const fantokens = await queryAutoPaginate<FanToken>('bitsong/fantoken/v1beta1/fantokens');

    return fantokens;
  } catch (error) {
    throw error;
  }
};
