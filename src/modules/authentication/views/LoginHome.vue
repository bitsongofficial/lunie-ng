<template>
  <div class="login-home-content">
    <h1 class="text-body-large text-white text-weight-medium q-mt-none q-mb-md text-center text-capitalize">{{ $t('login.title') }}</h1>

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
          <q-icon name="svguse:icons.svg#world|0 0 18 18" color="half-transparent-white" size="16px" />

          <label class="text-white text-body2 q-ml-md cursor-pointer">{{ opt.name }}</label>
        </div>
      </template>
      <template v-slot:option="{ itemProps, opt }">
        <q-item class="network-item row items-center cursor-pointer bg-secondary text-secondary" v-bind="itemProps">
          <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
        </q-item>
      </template>
    </q-select>

    <q-list>
      <item clickable details to="login/explore" v-ripple leftIcon="svguse:icons.svg#anchor" :title="$t('login.explore')" />
      <item clickable details :disable="!keplrAvailable" v-ripple leftIcon="svguse:icons.svg#chrome" @click="keplrSignIn" :title="$t('login.keplr')" />
      <item clickable disable leftIcon="svguse:icons.svg#chrome" :title="$t('login.extension')">
        <template v-slot:right>
          <q-chip class="soon-chip text-weight-bold text-caption-2 text-uppercase" color="alternative-4" text-color="white" size="sm">
            <label class="text-center full-width">
              {{ $t('general.soon') }}
            </label>
          </q-chip>
        </template>
      </item>
      <item clickable class="q-my-none" leftIcon="svguse:icons.svg#phone|0 0 18 25" disable :title="$t('login.mobile')">
        <template v-slot:right>
          <q-chip class="soon-chip text-weight-bold text-caption-2 text-uppercase" color="alternative-4" text-color="white" size="sm">
            <label class="text-center full-width">
              {{ $t('general.soon') }}
            </label>
          </q-chip>
        </template>
      </item>
    </q-list>

    <div class="column items-center" v-if="session">
      <q-btn @click="signOut" :ripple="false" class="signout-btn text-capitalize text-underline q-mx-auto text-body4 no-hoverable" dense flat unelevated text-color="white" padding="0">
        {{ $t('actions.signout') }}
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

    const session = computed(() => store.state.authentication.session);

    const signOut = async () => {
      try {
        await store.dispatch('authentication/signIn', undefined);
      } catch (error) {
        console.error(error);
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
      signOut,
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

.signout-btn {
  margin-top: 20px;
}
</style>
