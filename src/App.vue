<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'src/store';
import { SessionType } from './models';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    const session = computed(() => store.state.authentication.session);

    const init = async () => {
      if (session.value && session.value.sessionType === SessionType.KEPLR) {
        await store.dispatch('keplr/init');
        await store.dispatch('authentication/signIn', {
          sessionType: SessionType.KEPLR,
          address: store.state.keplr.accounts[0].address,
        });
      } else if (session.value) {
        await store.dispatch('authentication/signIn', session.value);
      }
    }

    window.addEventListener('keplr_keystorechange', () => {
      init().catch(err => console.error(err));
    });

    onMounted(() => {
      init().catch(err => console.error(err));
    });
  }
})
</script>
