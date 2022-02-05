<template>
  <router-view />
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onMounted } from 'vue';
import DisclaimerDialog from './components/DisclaimerDialog.vue';
import { useStore } from './store';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    const quasar = useQuasar();

    const openDisclaimerDialog = () => {
      quasar.dialog({
        component: DisclaimerDialog,
      });
    }

    onMounted(() => {
      setTimeout(() => {
        if (!store.state.settings.disclaimer) {
          openDisclaimerDialog();
        }
      }, 500);
    });
  }
});
</script>
