import { computed } from 'vue';
import { useStore } from 'src/store';
import { BigNumber } from 'bignumber.js';
import { shortDecimals } from 'src/common/numbers';

const useFiatConversion = () => {
  const store = useStore();
  const currency = computed(() => store.state.settings.currency);
  const currentPrice = computed(() => new BigNumber(store.getters['data/getCurrentPrice'] as number));

  const fiatConverter = (value: string | number | BigNumber) => {
    const amount = new BigNumber(value);

    return shortDecimals(currentPrice.value.multipliedBy(amount).toFixed());
  };

  return {
    currency,
    fiatConverter
  }
}

export { useFiatConversion };
