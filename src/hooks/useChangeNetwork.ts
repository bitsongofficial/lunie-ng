import { computed } from 'vue';
import { useStore } from 'src/store';
import { networks } from 'src/constants';

export const useChangeNetwork = (onChange?: () => Promise<void>) => {
  const store = useStore();
  const loadingNetwork = computed(() => store.state.authentication.changing);

  const network = computed({
    get: () => store.state.authentication.network,
    set: async (value) => {
      if (onChange) {
        await onChange();
      }

      await store.dispatch('authentication/changeNetwork', value);
    }
  });

  return {
    loadingNetwork,
    network,
    networks
  };
}
