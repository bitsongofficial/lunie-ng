import { BroadcastTxResponse, SigningStargateClient } from '@cosmjs/stargate';
import { useQuasar } from 'quasar';
import { toDecimal } from 'src/common/numbers';
import { networks, ibcChains, suggestChains, /* ethereum */ } from 'src/constants';
import { IBCTransferRequest, NetworkConfig } from 'src/models';
import { useStore } from 'src/store';
import { reactive, ref, computed, watch, onUnmounted, watchEffect } from 'vue';

import MessageDialog from 'src/components/MessageDialog.vue';

export const useIbcTransfer = () => {
  const quasar = useQuasar();
  const store = useStore();

  const allNetworks = computed(() => [...networks, /* ethereum */]);
  const btsgChain = allNetworks.value.find(el => el.id === 'bitsong-2b');

  const totalBtsg = ref<string>('0');
  const sending = computed(() => store.state.transfer.sending);

  const transferRequest = reactive<IBCTransferRequest>({
    from: btsgChain,
    to: undefined,
    fromAddress: '',
    toAddress: '',
    amount: ''
  });

  const ibc = computed(() => ibcChains.find(el => el.id === transferRequest.from?.id));

  const toChains = computed<Partial<NetworkConfig>[]>(() => {
    if (transferRequest.from) {
      if (ibc.value) {
        const availableIBC = Object.keys(ibc.value.ibc);

        return allNetworks.value.filter(el => el.id && availableIBC.includes(el.id));
      }
    }

    return [];
  });

  const fromChains = computed<Partial<NetworkConfig>[]>(() => {
    const availableIBC = ibcChains.map(el => el.id);

    return allNetworks.value.filter(el => el.id && availableIBC.includes(el.id));
  });

  const updateFromData = async (prevFrom: Partial<NetworkConfig> | undefined = undefined) => {
    try {
      if (transferRequest.from && transferRequest.from.id) {
        if (window.keplr && transferRequest.from.id !== 'ethereum') {
          await window.keplr.enable(transferRequest.from.id);

          if (prevFrom) {
            transferRequest.to = undefined;
          }

          const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(transferRequest.from.id);
          const [account] = await offlineSigner.getAccounts();
          const fromAddress = account.address;

          transferRequest.fromAddress = fromAddress;
          transferRequest.amount = '0';

          if (transferRequest.from.rpcURL) {
            const client = await SigningStargateClient.connectWithSigner(
              transferRequest.from.rpcURL,
              offlineSigner
            );

            if (ibc.value) {
              const res = await client.getBalance(fromAddress, ibc.value.btsgDenom);

              totalBtsg.value = toDecimal(res.amount);
            }
          }
        } else if(transferRequest.from.id === 'ethereum') {
          if (prevFrom) {
            transferRequest.to = btsgChain;
          }
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

  const updateToData = async () => {
    try {
      if (transferRequest.to && transferRequest.to.id) {
        if (window.keplr && transferRequest.to.id !== 'ethereum') {
          await window.keplr.enable(transferRequest.to.id);

          const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(transferRequest.to.id);
          const [account] = await offlineSigner.getAccounts();
          const toAddress = account.address;

          transferRequest.toAddress = toAddress;
        }
      } else {
        transferRequest.toAddress = '';
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error && window.keplr && error.message.includes('There is no chain info')) {
        const suggestChain = suggestChains.find(el => el.chainId === transferRequest.from?.id);

        if (suggestChain) {
          await window.keplr.experimentalSuggestChain(suggestChain);
          await updateToData();
        }
      }
    }
  };

  const submit = async () => {
    try {
      const res = await store.dispatch('transfer/transferIBC', transferRequest) as BroadcastTxResponse;

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

  const toWatcher = watch(
    () => transferRequest.to,
    async () => {
      try {
        await updateToData();
      } catch (error) {
        console.error(error);
      }
    },
    {
      immediate: true,
    }
  );

  const keplrWatch = watchEffect(async () => {
    if (window.keplr && transferRequest.from && transferRequest.from.id && transferRequest.from.id !== 'ethereum') {
      try {
        await window.keplr.enable(transferRequest.from.id);
      } catch (error) {
        console.error(error);
      }
    }
  });

  onUnmounted(() => {
    fromWatcher();
    toWatcher();
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
