<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();

    window.addEventListener('keplr_keystorechange', async () => {
      await store.dispatch('keplr/init');
      await store.dispatch('authentication/signIn', {
        sessionType: 'keplr',
        address: store.state.keplr.accounts[0].address,
      });
    });
  }
})
</script>
