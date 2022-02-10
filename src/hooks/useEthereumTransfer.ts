import { toErc20btsg } from 'src/common/numbers';
import { IBCTransferRequest, Transaction, TransactionStatus } from 'src/models';
import { useStore } from 'src/store';
import { computed, watch, onUnmounted } from 'vue';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { useQuasar } from 'quasar';

import MessageDialog from 'src/components/MessageDialog.vue';

export const useEthereumTransfer = (transferRequest: IBCTransferRequest) => {
  const quasar = useQuasar();
  const store = useStore();

  const ethereumAddress = computed(() => store.state.ethereum.address);
  const depositLoading = computed(() => store.state.ethereum.depositLoading);
  const approveLoading = computed(() => store.state.ethereum.approveLoading);
  const transactions = computed(() => store.getters['ethereum/pendingTransactions'] as Transaction[]);
  const pendingTransactions = computed(() => transactions.value.filter(el => el.status === TransactionStatus.PENDING));
  const mustApprove = computed(() => store.state.ethereum.mustApprove);
  const erc20Balance = computed(() => toErc20btsg(store.state.ethereum.balance.toString()));

  const connectMetamask = async () => {
    await store.dispatch('ethereum/connectMetamask');

    if (store.state.ethereum.address) {
      transferRequest.fromAddress = store.state.ethereum.address;
    }
  };

  const ethereumSubmit = async () => {
    if (!ethereumAddress.value) {
      await connectMetamask();
    } else {
      if (mustApprove.value) {
        await store.dispatch('ethereum/setApprove');

        quasar.dialog({
          component: MessageDialog,
          componentProps: {
            title: 'success.title',
            subtitle: 'success.approveTitle',
            description: 'success.approveDescription',
            success: true,
          },
        });
      } else {
        await store.dispatch('ethereum/deposit', transferRequest.toAddress);

        quasar.dialog({
          component: MessageDialog,
          componentProps: {
            title: 'success.title',
            subtitle: 'success.depositEthereumTitle',
            description: 'success.depositEthereumDescription',
            success: true,
          },
        });
      }
    }
  };

  store.watch((state) => state.ethereum.balance, (balance) => {
    if (transferRequest.from && transferRequest.from.id === 'ethereum') {
      transferRequest.amount = toErc20btsg(balance.toString());

      if (store.state.ethereum.address) {
        transferRequest.fromAddress = store.state.ethereum.address;
      }
    }
  }, { immediate: true });

  const fromWatcher = watch(
    () => transferRequest.from,
    (from) => {
      if (window.ethereum) {
        const ethereum = window.ethereum as MetaMaskInpageProvider;

        if (from && from.id === 'ethereum') {
          if (ethereumAddress.value) {
            transferRequest.amount = erc20Balance.value;
            transferRequest.fromAddress = ethereumAddress.value;
          } else {
            transferRequest.fromAddress = '';
          }

          ethereum.addListener('accountsChanged', connectMetamask);
        } else {
          ethereum.removeListener('accountsChanged', connectMetamask);
        }
      }
    },
    {
      immediate: true,
    }
  );

  onUnmounted(() => {
    fromWatcher();
  });

  return {
    pendingTransactions,
    transactions,
    approveLoading,
    mustApprove,
    depositLoading,
    erc20Balance,
    ethereumAddress,
    ethereumSubmit
  };
}
