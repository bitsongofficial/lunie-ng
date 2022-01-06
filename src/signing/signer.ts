import { SessionType, WalletSignData } from 'src/models';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { getWallet } from 'src/common/keystore';
import { getLedger } from 'src/common/ledger';
import Transport from '@ledgerhq/hw-transport';

export const getSigner = async (signingType: SessionType, { address, password }: WalletSignData, chainId: string, ledgerTransport?: Transport<string>) => {
  if (signingType === SessionType.LOCAL) {
    const serializedWallet = getWallet(address);

    if (serializedWallet !== null && serializedWallet.wallet) {
      const wallet = await DirectSecp256k1HdWallet.deserialize(
        serializedWallet.wallet,
        password
      );

      return wallet;
    }
  } else if (signingType === SessionType.LEDGER) {
    const result = await getLedger(ledgerTransport);

    if (result) {
      return result.ledger;
    }
  } else if (signingType === SessionType.KEPLR && window.keplr) {
    return window.keplr.getOfflineSignerOnlyAmino(chainId);
  }

  throw new Error(`Signing via ${signingType} is not supported`);
}
