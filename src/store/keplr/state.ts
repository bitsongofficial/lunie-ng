import { AccountData } from '@cosmjs/proto-signing';

export interface KeplrStateInterface {
  accounts: AccountData[];
  initialized: boolean;
  error: Error | undefined;
  loading: boolean;
}

function state (): KeplrStateInterface {
  return {
    accounts: [],
    initialized: false,
    error: undefined,
    loading: false
  }
}

export default state;
