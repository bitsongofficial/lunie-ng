import { BroadcastTxResponse, SigningStargateClient } from '@cosmjs/stargate';
import { useQuasar } from 'quasar';
import { toDecimal } from 'src/common/numbers';
import { networks, ibcChains, suggestChains } from 'src/constants';
import { NetworkConfig } from 'src/models';
import { useStore } from 'src/store';
import { reactive, ref, computed, watch, onUnmounted, watchEffect } from 'vue';

import MessageDialog from 'src/components/MessageDialog.vue';

export const useIbcTransfer = () => {
  const quasar = useQuasar();
  const store = useStore();

  const btsgChain = networks.find(el => el.id === 'bitsong-2b');
  const osmoChain = networks.find(el => el.id === 'osmosis-1');

  const totalBtsg = ref<string>('0');
  const sending = computed(() => store.state.transfer.sending);

  const transferRequest = reactive({
    from: ref<NetworkConfig | undefined>(btsgChain),
    to: ref<NetworkConfig | undefined>(osmoChain),
    fromAddress: ref<string>(''),
    toAddress: ref<string>(''),
    amount: ref<string>(''),
  });

  const ibc = computed(() => ibcChains.find(el => el.id === transferRequest.from?.id));

  const toChains = computed<NetworkConfig[]>(() => {
    if (transferRequest.from) {
      if (ibc.value) {
        const availableIBC = Object.keys(ibc.value.ibc);

        return networks.filter(el => availableIBC.includes(el.id));
      }
    }

    return [];
  });

  const fromChains = computed<NetworkConfig[]>(() => {
    const availableIBC = ibcChains.map(el => el.id);

    return networks.filter(el => availableIBC.includes(el.id));
  });

  const updateFromData = async (prevFrom: NetworkConfig | undefined = undefined) => {
    try {
      if (window.keplr && transferRequest.from) {
        await window.keplr.enable(transferRequest.from.id);

        if (prevFrom) {
          transferRequest.to = undefined;
        }

        const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(transferRequest.from.id);
        const [account] = await offlineSigner.getAccounts();
        const fromAddress = account.address;

        transferRequest.fromAddress = fromAddress;

        const client = await SigningStargateClient.connectWithSigner(
          transferRequest.from.rpcURL,
          offlineSigner
        );

        if (ibc.value) {
          const res = await client.getBalance(fromAddress, ibc.value.btsgDenom);

          totalBtsg.value = toDecimal(res.amount);
        }
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error && window.keplr && error.message.includes('There is no chain info')) {
        const suggestChain = suggestChains.find(el => el.chainId === transferRequest.from?.id);

        if (suggestChain) {
          await window.keplr.experimentalSuggestChain(suggestChain);
          await updateFromData();
        }
      }
    }
  };

  const submit = async () => {
    try {
      const res = await store.dispatch('transfer/transferIBC', transferRequest) as BroadcastTxResponse;
      console.log(res);
      await updateFromData();

      quasar.dialog({
        component: MessageDialog,
        componentProps: {
          title: 'success.title',
          subtitle: 'success.transferDescription',
          hash: res.transactionHash,
          mintscan: transferRequest.from?.explorerURL,
          success: true,
        },
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error && window.keplr && error.message.includes('There is no chain info')) {
        const suggestChain = suggestChains.find(el => el.chainId === transferRequest.from?.id);

        if (suggestChain) {
          await window.keplr.experimentalSuggestChain(suggestChain);
          await updateFromData();
        }
      } else {
        quasar.dialog({
          component: MessageDialog,
          componentProps: {
            title: 'errors.title',
            subtitle: 'errors.general',
            success: false,
          },
          fullWidth: true,
          maximized: true,
        });
      }
    }
  };

  const fromWatcher = watch(
    () => transferRequest.from,
    async (from, prevFrom) => {
      try {
        await updateFromData(prevFrom);
      } catch (error) {
        console.error(error);
      }
    },
    {
      immediate: true,
    }
  );

  const keplrWatch = watchEffect(async () => {
    if (window.keplr && transferRequest.from) {
      try {
        await window.keplr.enable(transferRequest.from.id);
      } catch (error) {
        console.error(error);
      }
    }
  });

  onUnmounted(() => {
    fromWatcher();
    keplrWatch();
  });

  return {
    fromChains,
    toChains,
    sending,
    transferRequest,
    totalBtsg,
    submit,
  };
}
