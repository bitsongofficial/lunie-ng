import { AccountData } from '@cosmjs/proto-signing';
import { LedgerSigner } from '@bitsongjs/sdk';
import Transport from '@ledgerhq/hw-transport';

export interface LedgerStateInterface {
  ledger?: LedgerSigner;
  accounts: AccountData[];
  transport?: Transport<string> | Transport;
  error: string | undefined;
  loading: boolean;
}

function state (): LedgerStateInterface {
  return {
    ledger: undefined,
    transport: undefined,
    accounts: [],
    loading: false,
    error: undefined,
  }
}

export default state;
