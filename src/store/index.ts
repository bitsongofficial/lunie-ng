import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
  createLogger,
  Plugin
} from 'vuex';

import createPersistedState from 'vuex-persistedstate';

import notifications from './notifications';
import { NotificationsStateInterface } from './notifications/state';

import authentication from './authentication';
import { AuthenticationStateInterface } from './authentication/state';

import data from './data';
import { DataStateInterface } from './data/state';

import keplr from './keplr';
import { KeplrStateInterface } from './keplr/state';

import ledger from './ledger';
import { LedgerStateInterface } from './ledger/state';

import settings from './settings';
import { SettingsStateInterface } from './settings/state';

import proposal from './proposal';
import { ProposalStateInterface } from './proposal/state';

import transfer from './transfer';
import { TransferStateInterface } from './transfer/state';

import ethereum from './ethereum';
import { EthereumStateInterface } from './ethereum/state';

export interface StateInterface {
  notifications: NotificationsStateInterface;
  authentication: AuthenticationStateInterface;
  data: DataStateInterface;
  keplr: KeplrStateInterface;
  ledger: LedgerStateInterface;
  settings: SettingsStateInterface;
  proposal: ProposalStateInterface;
  transfer: TransferStateInterface;
  ethereum: EthereumStateInterface;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key');

const plugins: Plugin<StateInterface>[] = [
  createPersistedState({
    paths: ['authentication', 'keplr', 'ledger', 'settings', 'proposal', 'ethereum.pendingTransactions', 'ethereum.bridgeTransactions']
  }),
];

if (!!process.env.DEBUGGING) {
  plugins.push(createLogger());
}

const modules = {
  notifications,
  authentication,
  data,
  keplr,
  ledger,
  settings,
  proposal,
  transfer,
  ethereum
};

const Store = createStore<StateInterface>({
  modules,
  plugins,
  // enable strict mode (adds overhead!)
  // for dev mode and --debug builds only
  strict: !!process.env.DEBUGGING,
  devtools: true,
});

export default Store;

export function useStore () {
  return vuexUseStore(storeKey);
}
