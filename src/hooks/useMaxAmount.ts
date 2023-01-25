import { DefaultGasPriceStep, FeeType } from 'src/constants';
import { getCoinLookup } from 'src/common/network';
import { MessageTypes } from 'src/models';
import { getFees } from 'src/signing/transaction-manager';
import { computed, ComputedRef } from 'vue';
import { useStore } from 'src/store';
import { BigNumber } from 'bignumber.js';

export const useMaxAmount = (denom: string | undefined, availableCoins: ComputedRef<BigNumber>) => {
  const store = useStore();
  const network = computed(() => store.state.authentication.network);
  const feeData = getFees(MessageTypes.SEND, network.value.stakingDenom);

  const getMaxAmount = () => {
    if (network.value.stakingDenom !== denom) {
      return availableCoins.value.toString();
    }

    if (feeData) {
      const coinLookup = getCoinLookup(feeData.fee[0].denom);

      if (coinLookup) {
        const coinDecimals = new BigNumber(DefaultGasPriceStep[FeeType.AVERAGE])
          .multipliedBy(feeData.gasEstimate)
          .times(coinLookup.chainToViewConversionFactor);

        return availableCoins.value.minus(coinDecimals).toString();
      }
    }
  }

  return {
    getMaxAmount,
  };
}
