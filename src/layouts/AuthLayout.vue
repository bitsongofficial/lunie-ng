<template>
  <q-layout class="bg-secondary" view="hhh lpR fff">
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

    <q-page-container class="container">
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
  </q-layout>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthLayout',
  setup() {
    const store = useStore();

    store.dispatch('authentication/resetLoadingData').catch((err) => {
      console.error(err);
    });
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
