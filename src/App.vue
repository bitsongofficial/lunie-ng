<template>
  <router-view />
</template>
<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, onMounted, computed, watch } from 'vue';
import { useStore } from './store';
import { i18n } from 'src/boot/i18n';
import DisclaimerDialog from './components/DisclaimerDialog.vue';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    const quasar = useQuasar();

    const language = computed(() => store.state.settings.language);

    watch(language, (lang) => {
      i18n.global.locale = lang;
    }, { immediate: true });

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
