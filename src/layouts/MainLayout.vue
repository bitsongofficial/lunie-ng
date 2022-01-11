<template>
  <q-layout class="bg-secondary" view="hhh LpR fff">
    <q-header class="header bg-transparent text-white">
      <q-toolbar class="header-toolbar container bg-transparent justify-between items-end">
        <q-toolbar-title class="text-body1 row items-center q-pt-sm">
          <q-btn dense flat round v-if="quasar.screen.lt.md" @click="leftDrawer = !leftDrawer">
            <q-icon name="svguse:icons.svg#menu|0 0 20 14" color="white" size="24px" />
          </q-btn>

          <q-avatar class="toolbar-avatar" v-if="!quasar.screen.lt.md">
            <img src="~assets/logo.svg">
          </q-avatar>

          <p class="text-body-large text-weight-medium text-white q-my-none" v-if="!quasar.screen.lt.md">wallet</p>
        </q-toolbar-title>

        <div class="row actions items-center no-wrap">
          <q-item class="profile-item" clickable v-if="session" @click="!loading && session ? onCopy(session.address) : null">
            <q-item-section class="column">
              <label class="text-half-transparent-white text-weight-medium q-mb-xs text-caption no-pointer-events">ADDRESS</label>
              <label class="text-white text-body2 no-pointer-events" v-if="!loading">{{ address }}</label>
              <q-skeleton type="text" width="118px" dark v-else></q-skeleton>
            </q-item-section>

            <q-item-section side v-if="!quasar.screen.lt.md">
              <q-btn @click.stop="" dense flat round to="/authentication" class="q-ml-md">
                <q-icon name="svguse:icons.svg#profile|0 0 15 17" color="white" size="16px" />
              </q-btn>
            </q-item-section>
          </q-item>
          <q-btn @click.stop="" dense flat round to="/authentication" class="q-ml-md" v-else>
            <q-icon name="svguse:icons.svg#profile|0 0 15 17" color="white" size="16px" />
          </q-btn>

          <q-select
            v-if="!quasar.screen.lt.md"
            v-model="network"
            rounded
            standout
            map-options
            :options="networks"
            bg-color="transparent-white"
            color="transparent-white"
            label-color="primary"
            class="extra-large q-mt-auto q-ml-md"
            no-error-icon
            hide-bottom-space
            :loading="loadingNetwork"
            :options-cover="false"
          >
            <template v-slot:selected-item="{ opt }">
              <div class="row items-center cursor-pointer">
                <label class="text-white text-body2 cursor-pointer">{{ opt.id }}</label>
              </div>
            </template>
            <template v-slot:option="{ itemProps, opt }">
              <q-item class="network-item row items-center cursor-pointer bg-secondary text-secondary" v-bind="itemProps">
                <label class="text-white text-body2 cursor-pointer">{{ opt.id }}</label>
              </q-item>
            </template>
          </q-select>
        </div>
      </q-toolbar>
    </q-header>

    <div class="container position-relative">
      <div class="drawer-container container">
        <q-drawer class="drawer-menu bg-transparent column" :class="{
          'back': back
        }" :persistent="true" show-if-above :overlay="quasar.screen.lt.md" v-model="leftDrawer" :width="270" side="left">
          <q-btn class="back-btn btn-medium" rounded unelevated @click="goBack" color="alternative-3" text-color="white" padding="15px 28px 16px 23px" v-if="back">
            <q-icon class="rotate-180 q-mr-md" name="svguse:icons.svg#arrow-right|0 0 14 14" color="white" size="12px" />
            <label class="text-h6 text-white text-uppercase no-pointer-events">back</label>
          </q-btn>

          <q-list class="menu-links">
            <menu-link icon="svguse:icons.svg#suitcase|0 0 18 16" title="Portfolio" link="/portfolio" />
            <menu-link icon="svguse:icons.svg#stack|0 0 17 17" title="Validators" link="/validators" />
            <menu-link icon="svguse:icons.svg#like|0 0 18 18" title="Proposals" link="/proposals" />
            <menu-link icon="svguse:icons.svg#swap|0 0 21 16" title="Transactions" :link="explorerURL" external />
            <menu-link icon="svguse:icons.svg#3d-cube|0 0 19 19" title="Bridge" :link="bridgeURL" newLink external v-if="bridgeURL" />
          </q-list>

          <q-select
            v-model="network"
            v-if="quasar.screen.lt.md"
            rounded
            standout
            map-options
            :options="networks"
            bg-color="transparent-white"
            color="transparent-white"
            label-color="primary"
            class="full-width medium q-mt-auto connection-item"
            no-error-icon
            hide-bottom-space
            :loading="loadingNetwork"
            :options-cover="false"
          >
            <template v-slot:selected-item="{ opt }">
              <div class="row items-center cursor-pointer">
                <label class="text-white text-body2 cursor-pointer">{{ opt.id }}</label>
              </div>
            </template>
            <template v-slot:option="{ itemProps, opt }">
              <q-item class="network-item row items-center cursor-pointer bg-secondary text-secondary" v-bind="itemProps">
                <label class="text-white text-body2 cursor-pointer">{{ opt.id }}</label>
              </q-item>
            </template>
          </q-select>

          <q-btn v-if="session" @click="signOut" class="full-width logout-btn btn-medium text-h6 col-12 col-md-3" rounded unelevated color="transparent-accent" text-color="white" padding="12px 24px 10px 26px">
            Sign Out
          </q-btn>
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
import { defineComponent, ref, computed, watch, onUnmounted } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { formatAddress } from 'src/common/address';
import { useClipboard } from 'src/hooks';
import { useChangeNetwork, useBack } from 'src/hooks';
import { useRouter } from 'vue-router';

import MenuLink from 'src/components/MenuLink.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuLink,
  },
  setup() {
    const { back, goBack } = useBack();
    const { network, networks, loadingNetwork } = useChangeNetwork(goBack);
    const quasar = useQuasar();
    const store = useStore();
    const router = useRouter();
    const leftDrawer = ref<boolean>(true);
    const session = computed(() => store.state.authentication.session);
    const address = computed(() => formatAddress(store.state.authentication.session?.address));
    const loading = computed(() => store.state.authentication.loading);

    const explorerURL = computed(() => {
      const session = store.state.authentication.session;

      if (session) {
        return `${network.value.explorerURL}account/${session.address}`;
      }

      return network.value.explorerURL;
    });

    const bridgeURL = computed(() => store.state.authentication.network.bridgeURL);

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

    const signOut = async () => {
      try {
        await store.dispatch('authentication/signIn', undefined);
        await router.replace({ name: 'authentication' });
      } catch (error) {
        console.error(error);
      }
    }

    return {
      bridgeURL,
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
      signOut,
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
}

.actions {
  margin-top: 10px;
}

.profile-item {
  background: $secondary;
  border-radius: 50px;
  padding: 12px 24px 12px 26px;
  border: 2px solid $accent-3;
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

.back-btn {
  max-width: 112px;
  margin-bottom: 84px;
}

.connection-item {
  margin-bottom: 16px;
}

.logout-btn {
  height: auto;
  margin-bottom: 40px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-top: auto;
  }
}
</style>
