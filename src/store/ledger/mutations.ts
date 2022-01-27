import { LedgerSigner } from '@cosmjs/ledger-amino';
import { AccountData } from '@cosmjs/proto-signing';
import Transport from '@ledgerhq/hw-transport';
import { MutationTree } from 'vuex'
import { LedgerStateInterface } from './state'

const mutation: MutationTree<LedgerStateInterface> = {
  setLoading(state, loading: boolean) {
    state.loading = loading;
  },
  setLedger(state, ledger: LedgerSigner) {
    state.ledger = ledger;
  },
  setTransport(state, transport: Transport) {
    state.transport = transport;
  },
  setAccounts(state, accounts: AccountData[]) {
    state.accounts = accounts;
  },
  setError(state, error: string) {
    state.error = error;
  },
}

export default mutation;
