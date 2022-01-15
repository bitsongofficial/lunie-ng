<template>
  <div class="login-home-content">
    <h1 class="text-body-large text-white text-weight-medium q-mt-none q-mb-md text-center">Welcome</h1>

    <q-select
      v-model="network"
      rounded
      standout
      map-options
      :options="networks"
      bg-color="transparent-white"
      color="transparent-white"
      label-color="primary"
      class="subtitle full-width medium q-mt-auto connection-item"
      no-error-icon
      hide-bottom-space
      :loading="loadingNetwork"
      :disable="loadingNetwork"
      :options-cover="false"
    >
      <template v-slot:selected-item="{ opt }">
        <div class="row items-center cursor-pointer">
          <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
        </div>
      </template>
      <template v-slot:option="{ itemProps, opt }">
        <q-item class="network-item row items-center cursor-pointer bg-secondary text-secondary" v-bind="itemProps">
          <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
        </q-item>
      </template>
    </q-select>

    <q-list>
      <item clickable details to="login/explore" v-ripple leftIcon="svguse:icons.svg#anchor" title="Explore with any address" />
      <item clickable details :disable="!keplrAvailable" v-ripple leftIcon="svguse:icons.svg#chrome" @click="keplrSignIn" title="Keplr Browser Extension" />
      <item clickable disable leftIcon="svguse:icons.svg#chrome" title="Bitsong Browser Extension">
        <template v-slot:right>
          <q-chip class="soon-chip text-weight-bold text-caption-2 text-uppercase" color="alternative-4" text-color="white" size="sm">
            <label class="text-center full-width">
              Soon
            </label>
          </q-chip>
        </template>
      </item>
      <item clickable class="q-my-none" leftIcon="svguse:icons.svg#phone|0 0 18 25" disable title="Ledger Bitsong App">
        <template v-slot:right>
          <q-chip class="soon-chip text-weight-bold text-caption-2 text-uppercase" color="alternative-4" text-color="white" size="sm">
            <label class="text-center full-width">
              Soon
            </label>
          </q-chip>
        </template>
      </item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { SessionType } from 'src/models';
import { useChangeNetwork } from 'src/hooks';

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
      keplrSignIn,
      ...useChangeNetwork(false)
    }
  }
});
</script>

<style lang="scss" scoped>
.login-home-content {
  padding: 0 7px;
}

.subtitle {
  margin-bottom: 48px;
}

.soon-chip {
  min-width: 70px;
  min-height: 36px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
}
</style>
