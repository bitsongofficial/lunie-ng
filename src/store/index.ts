import { InjectionKey } from 'vue';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
  createLogger,
  Plugin
} from 'vuex';

import notifications from './notifications';
import { NotificationsStateInterface } from './notifications/state';

export interface StateInterface {
  notifications: NotificationsStateInterface;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> = Symbol('vuex-key');

const plugins: Plugin<StateInterface>[] = [];

if (!!process.env.DEBUGGING) {
  plugins.push(createLogger());
}

const Store = createStore<StateInterface>({
  modules: {
    notifications,
  },
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
