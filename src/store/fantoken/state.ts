import { FanToken } from '@bitsongjs/sdk/build/codec/fantoken/fantoken';

export interface FantokenStateInterface {
  loading: boolean;
  fantokens: FanToken[];
}

function state (): FantokenStateInterface {
  return {
    loading: false,
    fantokens: []
  };
}

export default state;
