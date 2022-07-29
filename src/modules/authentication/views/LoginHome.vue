<template>
  <div class="login-home-content">
    <h1 class="text-body-large text-white text-weight-medium q-mt-none q-mb-md text-center">Welcome</h1>

    <p class="subtitle text-half-transparent-white text-wight-medium text-subtitle2 text-center">Bitsong Testnet</p>

    <q-list>
      <item clickable details to="login/explore" v-ripple leftIcon="svguse:icons.svg#anchor" title="Explore with any address" reverse />
      <item clickable details :disable="!keplrAvailable" v-ripple leftIcon="svguse:icons.svg#chrome" @click="keplrSignIn" title="Keplr Browser Extension" reverse />
      <item clickable details v-ripple leftIcon="svguse:icons.svg#phone|0 0 18 25" @click="walletConnectSignIn" title="Bitsong Mobile App" reverse />
      <item clickable disable class="q-my-none" leftIcon="svguse:icons.svg#chrome" title="Bitsong Browser Extension" reverse>
        <template v-slot:right>
          <q-chip class="soon-chip text-weight-bold text-caption-2 text-uppercase" color="dark-4" text-color="white" size="sm">
            <label class="text-center full-width">
              Soon
            </label>
          </q-chip>
        </template>
      </item>
    </q-list>

    <div class="column items-center" v-if="session">
      <q-btn @click="signOut" :ripple="false" class="signout-btn text-capitalize text-underline q-mx-auto text-body4 no-hoverable" dense flat unelevated text-color="white" padding="0">
        Signout
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { SessionType } from 'src/models';
import { walletConnect } from 'src/services';

import Item from 'src/components/Item.vue';

export default defineComponent({
  name: 'LoginHome',
  components: {
    Item,
  },
  setup() {
    const quasar = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const session = computed(() => store.state.authentication.session);

    const signOut = async () => {
      try {
        await store.dispatch('authentication/signIn', undefined);
      } catch (error) {
        console.error(error);
      }
    }

    const walletConnectSignIn = async () => {
      try {
        quasar.loading.show();

        if (walletConnect.connected) {
          await walletConnect.killSession();
        }

        await walletConnect.createSession();
      } catch (error) {
        console.error(error);
      } finally {
        quasar.loading.hide();
      }
    }

    const keplrSignIn = async () => {
      try {
        quasar.loading.show();
        await store.dispatch('keplr/init', 0);
        const accounts = store.state.keplr.accounts;

        if (accounts.length > 0) {
          const account = accounts[0];

          await store.dispatch('authentication/signIn', {
            address: account.address,
            sessionType: SessionType.KEPLR
          });
        }

        const path = (route.query.r as string) || { name: 'wallet' };
        await router.replace(path);
      } catch (error) {
        console.error(error);
      } finally {
        quasar.loading.hide();
      }
    };

    const keplrAvailable = computed(() => window.keplr);

    return {
      keplrAvailable,
      session,
      keplrSignIn,
      walletConnectSignIn,
      signOut
    }
  }
});
</script>

<style lang="scss" scoped>
.login-home-content {
  padding: 0 7px;
}

.subtitle {
  margin-bottom: 42px;
}

.soon-chip {
  min-width: 70px;
  min-height: 36px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}

.signout-btn {
  margin-top: 20px;
}
</style>
