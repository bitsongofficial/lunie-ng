export interface PeerMeta {
  description: string
  icons: string[]
  name: string
  url: string
}

export interface WalletConnectPayload<T> {
  event: string
  params: T[]
}

export interface WalletConnectionParam {
  accounts: string[]
  chainId: number
  peerId: string
  peerMeta: PeerMeta
}
