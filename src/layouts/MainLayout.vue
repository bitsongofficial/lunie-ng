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

        <q-item class="profile-item" clickable to="/authentication" v-if="session">
          <q-item-section class="column">
            <label class="text-half-transparent-white text-weight-medium q-mb-xs text-caption no-pointer-events">ADDRESS</label>
            <label class="text-white text-body2 no-pointer-events">{{ address }}</label>
          </q-item-section>

          <q-item-section side v-if="!quasar.screen.lt.md">
            <q-icon class="q-ml-md" name="svguse:icons.svg#profile|0 0 15 17" color="white" size="16px" />
          </q-item-section>
        </q-item>
      </q-toolbar>
    </q-header>

    <div class="container position-relative">
      <div class="drawer-container container">
        <q-drawer class="drawer-menu bg-transparent column" :class="{
          'back': back
        }" :persistent="!quasar.screen.lt.md" :overlay="quasar.screen.lt.md" v-model="leftDrawer" :width="270" side="left">
          <q-btn class="back-btn btn-medium" rounded unelevated @click="router.back" color="alternative-3" text-color="white" padding="15px 28px 16px 23px" v-if="back">
            <q-icon class="rotate-180 q-mr-md" name="svguse:icons.svg#arrow-right|0 0 14 14" color="white" size="12px" />
            <label class="text-h6 text-white text-uppercase no-pointer-events">back</label>
          </q-btn>

          <q-list class="menu-links">
            <menu-link icon="svguse:icons.svg#suitcase|0 0 18 16" title="Portfolio" link="/portfolio" />
            <menu-link icon="svguse:icons.svg#stack|0 0 17 17" title="Validators" link="/validators" />
            <menu-link icon="svguse:icons.svg#like|0 0 18 18" title="Proposals" link="/proposals" />
            <menu-link icon="svguse:icons.svg#swap|0 0 21 16" title="Transactions" :link="network.explorerURL" external />
          </q-list>

          <q-item class="connection-item q-mt-auto">
            <q-item-section>
              <div class="row items-center justify-between">
                <label class="text-white text-h5">Bitsong-2b</label>

                <label class="text-accent-4 text-h5 q-ml-xs q-mt-none">connected</label>
              </div>
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
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';
import MenuLink from 'src/components/MenuLink.vue';
import { useQuasar } from 'quasar';
import { formatAddress } from 'src/common/address';
import { network } from 'src/constants';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuLink,
  },
  setup() {
    const quasar = useQuasar();
    const router = useRouter();
    const store = useStore();
    const leftDrawer = ref<boolean>(false);
    const back = computed(() => router.currentRoute.value.meta.back === true);
    const session = computed(() => store.state.authentication.session);
    const address = computed(() => formatAddress(store.state.authentication.session?.address));

    const responsiveWatch = watch(
      () => quasar.screen.lt.md,
      (value) => {
        leftDrawer.value = !value;
      },
      {
        immediate: true,
      }
    );

    onMounted(async () => {
      await store.dispatch('authentication/signIn', session.value);
    });

    onUnmounted(() => {
      responsiveWatch();
    });

    return {
      address,
      session,
      quasar,
      router,
      leftDrawer,
      back,
      network
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

.profile-item {
  background: $secondary;
  border-radius: 50px;
  margin-top: 10px;
  padding: 12px 24px 12px 26px;
  border: 2px solid $accent-3;
}

.connection-item {
  margin-bottom: 40px;
  background: $alternative-2;
  border-radius: 20px;
  padding: 12px 26px;
  min-height: 40px;
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
</style>
