import { suggestChains } from './../constants/chain';
import { reactive, ref, computed, watch, watchEffect, onUnmounted } from 'vue';
import { BroadcastTxResponse, SigningStargateClient } from '@cosmjs/stargate';
import { Chain, ChainPrefix } from 'src/models';
import { useStore } from 'src/store';
import { chains as fromChains } from 'src/constants';
import { useQuasar } from 'quasar';
import { toDecimal } from 'src/util';

import MessageDialog from 'src/components/MessageDialog.vue';
import KeplrDialog from 'src/components/KeplrDialog.vue';

export const useTransferIBC = () => {
  const store = useStore();
  const quasar = useQuasar();

  const enabledWallet = ref<boolean>(false);
  const sending = computed(() => store.state.transfer.sending);

  const btsgChain = fromChains.find(el => el.prefix === ChainPrefix.BITSONG);
  const osmoChain = fromChains.find(el => el.prefix === ChainPrefix.OSMO);

  const transferRequest = reactive({
    from: ref<Chain | undefined>(btsgChain),
    to: ref<Chain | undefined>(osmoChain),
    fromAddress: ref<string>(''),
    toAddress: ref<string>(''),
    amount: ref<string>(''),
  });

  const toChains = computed<Chain[]>(() => {
    if (transferRequest.from) {
      const availableIBC = Object.keys(transferRequest.from.ibc);

      return fromChains.filter(el => availableIBC.includes(el.prefix))
    }

    return [];
  });

  const totalBtsg = ref<string>('0');

  const updateFromData = async (prevFrom: Chain | undefined = undefined) => {
    try {
      if (window.keplr && transferRequest.from) {
        await window.keplr.enable(transferRequest.from.chainId);

        if (prevFrom) {
          transferRequest.to = undefined;
        }

        const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(transferRequest.from.chainId);
        const [account] = await offlineSigner.getAccounts();
        const fromAddress = account.address;

        transferRequest.fromAddress = fromAddress;

        const client = await SigningStargateClient.connectWithSigner(
          transferRequest.from.rpc,
          offlineSigner
        );

        const res = await client.getBalance(fromAddress, transferRequest.from.btsgDenom);

        totalBtsg.value = toDecimal(res.amount);
      } else if (!window.keplr) {
        quasar.dialog({
          component: KeplrDialog,
          fullWidth: true,
          maximized: true,
        });
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error && window.keplr && error.message.includes('There is no chain info')) {
        const suggestChain = suggestChains.find(el => el.chainId === transferRequest.from?.chainId);

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
      await updateFromData();

      quasar.dialog({
        component: MessageDialog,
        componentProps: {
          title: 'Success!',
          subtitle: 'You have successfully transferred your btsg.',
          hash: res.transactionHash,
          mintscan: transferRequest.from?.mintscan,
          success: true,
        },
        fullWidth: true,
        maximized: true,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error && window.keplr && error.message.includes('There is no chain info')) {
        const suggestChain = suggestChains.find(el => el.chainId === transferRequest.from?.chainId);

        if (suggestChain) {
          await window.keplr.experimentalSuggestChain(suggestChain);
          await updateFromData();
        }
      } else {
        quasar.dialog({
          component: MessageDialog,
          componentProps: {
            title: 'Error!',
            subtitle: 'Transaction failed.',
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

  window.addEventListener('keplr_keystorechange', () => {
    updateFromData().catch(err => console.error(err));
  });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const keplrWatch = watchEffect(async () => {
    if (window.keplr && transferRequest.from) {
      try {
        await window.keplr.enable(transferRequest.from.chainId);
        enabledWallet.value = true;
      } catch (error) {
        console.error(error);
        enabledWallet.value = false;
      }
    }
  });

  onUnmounted(() => {
    fromWatcher();
    keplrWatch();
  });

  return {
    enabledWallet,
    fromChains,
    toChains,
    sending,
    transferRequest,
    totalBtsg,
    submit,
  }
}
