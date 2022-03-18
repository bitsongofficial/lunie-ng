import { DefaultGasPriceStep, FeeType } from 'src/constants';
import { getCoinLookup } from 'src/common/network';
import { MessageTypes, NetworkConfig } from 'src/models';
import { getFees } from 'src/signing/transaction-manager';
import { computed, ComputedRef } from 'vue';
import { useStore } from 'src/store';
import { BigNumber } from 'bignumber.js';

export const useMaxAmount = (availableCoins: ComputedRef<BigNumber>, fromNetwork?: ComputedRef<Partial<NetworkConfig> | undefined>) => {
  const store = useStore();
  const network = computed(() => {
    if (fromNetwork && fromNetwork.value) {
      return fromNetwork.value;
    }

    return store.state.authentication.network;
  });
  const feeData = computed(() => {
    if (network.value.stakingDenom) {
      return getFees(MessageTypes.SEND, network.value.stakingDenom);
    }

    return null;
  });

  const getMaxAmount = () => {
    if (feeData.value) {
      const coinLookup = getCoinLookup(feeData.value.fee[0].denom);

      if (coinLookup) {
        const coinDecimals = new BigNumber(DefaultGasPriceStep[FeeType.AVERAGE])
          .multipliedBy(feeData.value.gasEstimate)
          .times(coinLookup.chainToViewConversionFactor);

        return availableCoins.value.minus(coinDecimals).toString();
      }
    }
  }

  return {
    getMaxAmount,
  };
}
