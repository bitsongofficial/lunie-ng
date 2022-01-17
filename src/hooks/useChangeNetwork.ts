import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'src/store';
import { networks } from 'src/constants';

export const useChangeNetwork = (refresh = true, onChange?: () => Promise<void>) => {
  const store = useStore();
  const router = useRouter();
  const loadingNetwork = computed(() => store.state.authentication.changing || store.state.authentication.loading);

  const network = computed({
    get: () => store.state.authentication.network,
    set: async (value) => {
      try {
        if (onChange) {
          await onChange();
        }

        await store.dispatch('authentication/changeNetwork', { network: value , refresh });
      } catch (error) {
        console.error(error);

        if (!store.state.authentication.session) {
          await router.replace({ name: 'authentication' });
        }
      }
    }
  });

  return {
    loadingNetwork,
    network,
    networks
  };
}
