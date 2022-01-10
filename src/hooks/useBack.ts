import { computed } from 'vue';
import { useRouter } from 'vue-router';

export const useBack = () => {
  const router = useRouter();
  const back = computed(() => router.currentRoute.value.meta.back === true);

  const goBack = async () => {
    if (back.value) {
      const parent = router.currentRoute.value.meta.parent as string;
      await router.replace(parent);
    }
  };

  return {
    goBack,
    back
  }
}
