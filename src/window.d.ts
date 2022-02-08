import { Window as KeplrWindow } from '@keplr-wallet/types';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { providers } from 'ethers';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ethereum: MetaMaskInpageProvider | providers.ExternalProvider;
  }
}
