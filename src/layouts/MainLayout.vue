<template>
  <q-layout class="bg-dark" view="hhh LpR fff">
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

            <p class="text-body-large text-weight-medium text-white q-my-none text-lowercase" v-if="!quasar.screen.lt.md">wallet</p>

            <q-badge label="TESTNET" class="logo-badge text-weight-medium text-uppercase text-caption-2" text-color="dark" color="primary"></q-badge>
          </q-btn>
        </q-toolbar-title>

        <q-btn class="btn-medium" :disable="!session || (session && session.sessionType !== 'keplr')" rounded unelevated color="primary" text-color="dark" padding="0 40px 0 26px" @click="openGetBTSGDialog">
          <q-icon class="btsg-coin-icon" name="svguse:icons.svg#coin|0 0 24 24" color="dark" size="24px" />
          <label class="text-body2 text-dark text-untransform no-pointer-events">Get BTSG</label>
        </q-btn>
      </q-toolbar>
    </q-header>

    <div class="container position-relative">
      <div class="drawer-container container">
        <q-drawer class="drawer-menu bg-transparent column no-wrap" :class="{
          'back': back
        }" :persistent="true" show-if-above :overlay="quasar.screen.lt.md" v-model="leftDrawer" :width="270" side="left">
          <q-btn class="back-btn btn-medium" rounded unelevated @click="goBack" color="transparent-white" text-color="white" padding="15px 28px 16px 23px" v-if="back">
            <q-icon class="rotate-180 q-mr-auto" name="svguse:icons.svg#arrow-right|0 0 14 14" color="white" size="14px" />
            <label class="text-h6 text-white text-uppercase no-pointer-events">back</label>
          </q-btn>

          <q-list class="menu-links">
            <menu-link icon="svguse:icons.svg#suitcase|0 0 18 16" title="Portfolio" link="/portfolio" />
            <menu-link icon="svguse:icons.svg#assets|0 0 17 18" title="Assets" link="/assets" />
            <menu-link icon="svguse:icons.svg#stats|0 0 20 12" title="Stats" link="/stats" />
            <menu-link icon="svguse:icons.svg#coins|0 0 22 16" title="Fantoken" link="/fantokens" />
            <menu-link icon="svguse:icons.svg#stack|0 0 17 17" title="Validators" link="/validators" />
            <menu-link icon="svguse:icons.svg#like|0 0 18 18" :count="votingProposalsCount" title="Proposals" link="/proposals" />
          </q-list>

          <q-item class="q-mt-auto profile-item" clickable>
            <q-item-section avatar @click="goToAuthentication">
              <q-btn padding="2px" dense flat unelevated round>
                <q-icon class="rotate-180" name="svguse:icons.svg#arrow-right|0 0 14 14" color="primary" size="12px" />
              </q-btn>
            </q-item-section>

            <q-item-section class="column no-wrap" v-if="session" @click.stop="!loading && session ? onCopy(session.address) : null">
              <label class="text-half-transparent-white text-weight-medium q-mb-xs text-caption no-pointer-events">ADDRESS</label>
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
import { useClipboard } from 'src/hooks';
import { useBack } from 'src/hooks';
import { useRouter } from 'vue-router';

import MenuLink from 'src/components/MenuLink.vue';
import FaucetDialog from 'src/components/FaucetDialog.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuLink,
  },
  setup() {
    const { back, goBack } = useBack();
    const quasar = useQuasar();
    const store = useStore();
    const router = useRouter();
    const leftDrawer = ref<boolean>(true);
    const session = computed(() => store.state.authentication.session);
    const address = computed(() => formatShortAddress(store.state.authentication.session?.address));
    const loading = computed(() => store.state.authentication.loading);
    const votingProposalsCount = computed(() => store.getters['data/votingProposalsCount'] as number);

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

    const openGetBTSGDialog = () => {
      quasar.dialog({
        component: FaucetDialog,
        fullWidth: true,
        maximized: true,
      });
    }

    return {
      votingProposalsCount,
      loading,
      address,
      session,
      quasar,
      leftDrawer,
      back,
      goToAuthentication,
      goBack,
      openGetBTSGDialog,
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

.back-btn {
  max-width: 112px;
  margin-bottom: 84px;
}

.logo-badge {
  margin-left: 21px;
  padding: 8px;
}

.btsg-coin-icon {
  margin-right: 21px;
}
</style>
