<template>
  <q-layout class="bg-secondary" view="hHh lpR fff">
    <q-header class="header bg-transparent text-white">
      <q-toolbar class="header-toolbar container bg-transparent justify-between items-end">
        <q-toolbar-title class="text-body1 row items-center q-pt-sm">
          <q-avatar class="toolbar-avatar">
            <img src="~assets/logo.svg">
          </q-avatar>

          <p class="text-body-large text-weight-medium text-white q-my-none">wallet</p>
        </q-toolbar-title>

        <q-item class="profile-item" clickable>
          <q-item-section class="column">
            <label class="text-half-transparent-white text-body6 no-pointer-events">ADDRESS</label>
            <label class="text-white text-body4 no-pointer-events">bitsong17dmxq...u085</label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="svguse:icons.svg#profile|0 0 15 17" color="white" size="14px" />
          </q-item-section>
        </q-item>
      </q-toolbar>
    </q-header>

    <div class="container position-relative">
      <q-drawer class="drawer-menu bg-transparent column" persistent v-model="leftDrawer" :width="270" side="left">
        <q-list class="menu-links">
          <menu-link icon="svguse:icons.svg#suitcase|0 0 18 16" title="Portfolio" link="portfolio" />
          <menu-link icon="svguse:icons.svg#stack|0 0 17 17" title="Validators" link="validators" />
          <menu-link icon="svguse:icons.svg#like|0 0 18 18" title="Proposal" link="proposal" />
          <menu-link icon="svguse:icons.svg#swap|0 0 21 16" title="Transactions" link="transactions" />
        </q-list>

        <q-item class="connection-item q-mt-auto">
          <q-item-section>
            <q-item-label class="text-white text-h6">Bitsong-2b</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label class="text-accent-4 text-h6">connected</q-item-label>
          </q-item-section>
        </q-item>
      </q-drawer>

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
import { defineComponent, ref } from 'vue';
import MenuLink from 'src/components/MenuLink.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    MenuLink,
  },
  setup() {
    const leftDrawer = ref<boolean>(true);

    return {
      leftDrawer,
    }
  }
});
</script>

<style lang="scss" scoped>
.header-toolbar {
  padding-top: 50px;
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
  padding: 12px 24px 12px 26px;
  border: 2px solid $accent-3;
}

.connection-item {
  margin-bottom: 40px;
  background: $alternative-2;
  border-radius: 20px;
  padding: 12px 32px;
  min-height: 40px;
}
</style>
