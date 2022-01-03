import { getWallet } from '~/common/keystore'
import { getLedger } from '~/common/ledger'

export async function getSigner(
  signingType,
  { address, password },
  chainId,
  ledgerTransport
) {
  if (signingType === `local`) {
    const { wallet: serializedWallet } = getWallet(address)

    const { DirectSecp256k1HdWallet } = await import('@cosmjs/proto-signing')
    const wallet = await DirectSecp256k1HdWallet.deserialize(
      serializedWallet,
      password
    )

    return wallet
  } else if (signingType === `ledger`) {
    const { ledger } = await getLedger(ledgerTransport)
    return ledger
  } else if (signingType === `keplr`) {
    return window.getOfflineSignerOnlyAmino(chainId)
  }

  throw new Error(`Signing via ${signingType} is not supported`)
}
