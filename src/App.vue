<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();

    window.addEventListener('keplr_keystorechange', async () => {
      await store.dispatch('authentication/init');
    });

    onMounted(() => {
      store.dispatch('authentication/init').catch(err => console.error(err));
    });
  }
})
</script>
