import { toErc20btsg } from 'src/common/numbers';
import { IBCTransferRequest } from 'src/models';
import { useStore } from 'src/store';
import { computed, watch, onUnmounted, Ref } from 'vue';
import { MetaMaskInpageProvider } from '@metamask/providers';

export const useEthereumTransfer = (transferRequest: IBCTransferRequest, enableForm: Ref<boolean>) => {
  const store = useStore();

  const ethereumAddress = computed(() => store.state.ethereum.address);
  const depositLoading = computed(() => store.state.ethereum.depositLoading);
  const approveLoading = computed(() => store.state.ethereum.approveLoading);
  const transactions = computed(() => store.state.ethereum.pendingTransactions);
  const mustApprove = computed(() => store.state.ethereum.mustApprove);
  const erc20Balance = computed(() => toErc20btsg(store.state.ethereum.balance.toString()));

  const connectMetamask = async () => {
    if (enableForm.value) {
      await store.dispatch('ethereum/connectMetamask');

      if (store.state.ethereum.address) {
        transferRequest.fromAddress = store.state.ethereum.address;
      }
    }
  };

  const ethereumSubmit = async () => {
    if (!ethereumAddress.value) {
      await connectMetamask();
    } else {
      if (mustApprove.value) {
        await store.dispatch('ethereum/setApprove');
      } else {
        await store.dispatch('ethereum/deposit', transferRequest.toAddress);
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
          transferRequest.fromAddress = '';

          ethereum.on('accountsChanged', connectMetamask);
        } else {
          ethereum.off('accountsChanged', connectMetamask);
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
    transactions,
    approveLoading,
    mustApprove,
    depositLoading,
    erc20Balance,
    ethereumAddress,
    ethereumSubmit
  };
}
