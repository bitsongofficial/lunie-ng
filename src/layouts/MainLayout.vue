<template>
  <q-layout class="bg-secondary" view="hhh LpR fff">
    <q-header class="header bg-transparent text-white">
      <q-toolbar class="header-toolbar container bg-transparent justify-between items-end">
        <q-toolbar-title class="text-body1 row items-center q-pt-sm">
          <q-btn dense flat round v-if="quasar.screen.lt.md" @click="leftDrawer = !leftDrawer">
            <q-icon name="svguse:icons.svg#menu|0 0 20 14" color="white" size="24px" />
          </q-btn>

          <q-btn class="no-hoverable" :ripple="false" flat unelevated padding="0" to="/portfolio">
            <q-avatar class="toolbar-avatar" v-if="!quasar.screen.lt.md">
              <img src="~assets/logo.svg">
            </q-avatar>

            <p class="text-body-large text-weight-medium text-white q-my-none text-capitalize" v-if="!quasar.screen.lt.md">wallet</p>
          </q-btn>
        </q-toolbar-title>

        <q-btn class="settings-btn" padding="4px" dense flat unelevated round>
          <q-icon name="svguse:icons.svg#setting|0 0 20 20" color="white" size="20px" />

          <q-menu class="settings-menu" anchor="bottom middle" self="top middle" :offset="[0, 26]">
            <q-icon class="settings-icon" name="svguse:icons.svg#triangle|0 0 22 17" size="32px" />

            <q-btn-toggle
              v-model="settingType"
              toggle-color="primary"
              flat
              unelevated
              :ripple="false"
              text-color="accent"
              toggle-text-color="white"
              padding="0 8px"
              :options="settingsType"
              stretch
            />

            <q-separator class="settings-separator" size="2px" color="accent-3" />

            <div class="options-list scroll scroll--transparent">
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                mode="out-in"
                appear
              >
                <q-option-group
                  v-if="settingType === 'language'"
                  v-model="language"
                  :options="languages"
                  color="white"
                />
                <q-option-group
                  v-else
                  v-model="currency"
                  :options="currencies"
                  color="white"
                />
              </transition>
            </div>
          </q-menu>
        </q-btn>

        <q-select
          v-model="network"
          rounded
          standout
          map-options
          :options="networks"
          bg-color="transparent-white"
          color="transparent-white"
          label-color="primary"
          class="medium-large white"
          no-error-icon
          hide-bottom-space
          :loading="loadingNetwork"
          :disable="loadingNetwork"
          :options-cover="false"
        >
          <template v-slot:selected-item="{ opt }">
            <div class="row items-center cursor-pointer">
              <q-icon name="svguse:icons.svg#world|0 0 18 18" color="half-transparent-white" size="14px" />

              <label class="text-white text-body2 q-ml-md q-mr-lg cursor-pointer">{{ opt.name }}</label>
            </div>
          </template>
          <template v-slot:option="{ itemProps, opt }">
            <q-item class="network-item row items-center cursor-pointer bg-secondary text-secondary" v-bind="itemProps">
              <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
            </q-item>
          </template>
        </q-select>
      </q-toolbar>
    </q-header>

    <div class="container position-relative">
      <div class="drawer-container container">
        <q-drawer class="drawer-menu bg-transparent column no-wrap" :class="{
          'back': back
        }" :persistent="true" show-if-above :overlay="quasar.screen.lt.md" v-model="leftDrawer" :width="270" side="left">
          <q-btn class="back-btn btn-medium" rounded unelevated @click="goBack" color="alternative-3" text-color="white" padding="15px 28px 16px 23px" v-if="back">
            <q-icon class="rotate-180 q-mr-md" name="svguse:icons.svg#arrow-right|0 0 14 14" color="white" size="12px" />
            <label class="text-h6 text-white text-uppercase no-pointer-events">{{ $t('actions.back') }}</label>
          </q-btn>

          <q-list class="menu-links">
            <menu-link icon="svguse:icons.svg#suitcase|0 0 18 16" :title="$t('menu.portfolio')" link="/portfolio" />
            <menu-link icon="svguse:icons.svg#assets|0 0 17 18" :title="$t('menu.assets')" link="/assets" />
            <menu-link icon="svguse:icons.svg#stats|0 0 20 12" :title="$t('menu.stats')" link="/stats" />
            <menu-link icon="svguse:icons.svg#stack|0 0 17 17" :title="$t('menu.validators')" link="/validators" />
            <menu-link icon="svguse:icons.svg#like|0 0 18 18" :count="votingProposalsCount" :title="$t('menu.proposals')" link="/proposals" />
            <menu-link icon="svguse:icons.svg#3d-cube|0 0 19 19" :title="$t('menu.bridge')" link="/bridge" v-if="network.id === 'bitsong-2b' && session?.sessionType === 'keplr'" />
            <menu-link icon="svguse:icons.svg#swap|0 0 21 16" :title="$t('menu.transactions')" :link="explorerURL" external />
          </q-list>

          <a class="coingecko text-center q-mt-auto text-quart-transparent-white text-body4" :href="coingecko" target="_blank">{{ $t('general.coingecko') }}</a>

          <q-item class="profile-item" clickable>
            <q-item-section avatar @click="goToAuthentication">
              <q-btn padding="2px" dense flat unelevated round>
                <q-icon class="rotate-180" name="svguse:icons.svg#arrow-right|0 0 14 14" color="white" size="12px" />
              </q-btn>
            </q-item-section>

            <q-item-section class="column no-wrap" v-if="session" @click.stop="!loading && session ? onCopy(session.address) : null">
              <label class="text-half-transparent-white text-weight-medium q-mb-xs text-caption no-pointer-events text-uppercase">{{ $t('general.address') }}</label>
              <label class="profile-item-address text-white text-body2 no-pointer-events" v-if="!loading">{{ address }}</label>
              <q-skeleton type="text" width="118px" dark v-else></q-skeleton>
            </q-item-section>

            <q-item-section v-if="session" side @click.stop="!loading && session ? onCopy(session.address) : null">
              <q-icon name="svguse:icons.svg#copy|0 0 18 18" color="quart-transparent-white" size="15px" />
            </q-item-section>
          </q-item>
        </q-drawer>
      </div>

      <q-page-container>
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            mode="out-in"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page-container>
    </div>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onUnmounted, onMounted } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { formatShortAddress } from 'src/common/address';
import { useChangeNetwork, useBack, useClipboard } from 'src/hooks';
import { useRouter } from 'vue-router';
import { settingsType, currencies, languages } from 'src/constants';

import MenuLink from 'src/components/MenuLink.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuLink,
  },
  setup() {
    const { back, goBack } = useBack();
    const { network, networks, loadingNetwork } = useChangeNetwork(true, goBack);
    const quasar = useQuasar();
    const store = useStore();
    const router = useRouter();
    const leftDrawer = ref<boolean>(true);
    const session = computed(() => store.state.authentication.session);
    const address = computed(() => formatShortAddress(store.state.authentication.session?.address));
    const loading = computed(() => store.state.authentication.loading);
    const votingProposalsCount = computed(() => store.getters['data/votingProposalsCount'] as number);
    const settingType = ref('language');
    const language = computed({
      get: () => store.state.settings.language,
      set: (value) => {
        store.commit('settings/setLanguage', value);
      }
    });
    const currency = computed({
      get: () => store.state.settings.currency,
      set: (value) => {
        store.commit('settings/setCurrency', value);
      }
    });

    const explorerURL = computed(() => {
      const session = store.state.authentication.session;

      if (session) {
        return `${network.value.explorerURL}account/${session.address}`;
      }

      return network.value.explorerURL;
    });

    const responsiveWatch = watch(
      () => quasar.screen.lt.md,
      (value) => {
        leftDrawer.value = !value;
      },
      {
        immediate: true,
      }
    );

    onUnmounted(() => {
      responsiveWatch();
    });

    window.addEventListener('keplr_keystorechange', async () => {
      await store.dispatch('authentication/init');
    });

    onMounted(() => {
      store.dispatch('authentication/init').catch(err => console.error(err));
    });

    const goToAuthentication = async () => {
      try {
        await router.replace({ name: 'authentication' });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    return {
      votingProposalsCount,
      loadingNetwork,
      network,
      networks,
      loading,
      address,
      explorerURL,
      session,
      quasar,
      leftDrawer,
      back,
      settingType,
      currency,
      currencies,
      language,
      languages,
      coingecko: process.env.VUE_APP_COINGECKO_WEBSITE,
      settingsType: settingsType.map(el => ({ ...el, class: 'no-hoverable text-capitalize text-body2 text-weight-medium' })),
      goToAuthentication,
      goBack,
      ...useClipboard(),
    }
  }
});
</script>

<style lang="scss" scoped>
.header-toolbar {
  padding-top: 20px;
  padding-bottom: 20px;
}

.toolbar-avatar {
  width: 40px;
  height: 40px;
  margin-right: 24px;
}

.menu-links {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 8px;
  margin-bottom: 16px;
}

.actions {
  margin-top: 10px;
}

.profile-item {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  border-radius: 30px;
  padding: 12px 24px 11px 24px;
  margin-bottom: 51px;
  min-height: 58px;

  &::v-deep(.q-item__section--avatar) {
    min-width: unset;
    padding-right: 18px;
  }

  &::v-deep(.q-item__section--side:not(.q-item__section--avatar)) {
    min-width: unset;
    padding-left: 28px;
  }
}

.profile-item-address {
  overflow: hidden;
  text-overflow: ellipsis;
}

.network-item {
  padding: 16px 24px;
}

.drawer-container {
  @media screen and (min-width: $breakpoint-md-min) {
    position: fixed;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translateX(-50%);
  }
}

.settings-btn {
  margin-right: 48px;
}

.back-btn {
  max-width: 112px;
  margin-bottom: 84px;
}

.settings-separator {
  margin-top: 16px;
  margin-bottom: 24px;
  opacity: 0.1;
}

.options-list {
  max-height: 200px;
}

.coingecko {
  text-decoration: none;
  margin-bottom: 20px;
}
</style>
