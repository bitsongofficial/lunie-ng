import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';
import { SessionType, WalletConnectionParam, WalletConnectPayload } from 'src/models';
import Router from 'src/router';
import Store from 'src/store';

// Create a connector
const walletConnect = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org', // Required
  qrcodeModal: QRCodeModal,
});

const walletConnectSignIn = async (payload: WalletConnectPayload<WalletConnectionParam>) => {
  const { accounts } = payload.params[0];

  console.log(payload);

  if (payload.params.length > 0) {
    if (accounts.length > 0) {
      const account = accounts[0];

      await Store.dispatch('authentication/signIn', {
        address: account,
        sessionType: SessionType.WALLET_CONNECT
      });

      const path = { name: 'wallet' };
      await Router.replace(path);
    }
  }
}

// Subscribe to connection events
walletConnect.on('connect', async (error, payload) => {
  if (error) {
    throw error;
  }

  await walletConnectSignIn(payload);
});

walletConnect.on('session_update', async (error, payload) => {
  if (error) {
    throw error;
  }

  await walletConnectSignIn(payload);
});

walletConnect.on('disconnect', (error, payload) => {
  if (error) {
    throw error;
  }

  // Delete connector
  console.log(payload);
});

export default walletConnect;
