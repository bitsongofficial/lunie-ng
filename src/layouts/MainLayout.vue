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
      </q-toolbar>
    </q-header>

    <div class="container position-relative">
      <q-drawer class="drawer-menu bg-transparent" persistent v-model="leftDrawer" :width="270" side="left">
        <q-list>
          <menu-link title="Portfolio" link="portfolio" />
          <menu-link title="Login" link="authentication" />
        </q-list>
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
</style>
