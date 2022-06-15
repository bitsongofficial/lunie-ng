export enum SessionType {
  KEPLR = 'keplr',
  LOCAL = 'local',
  LEDGER = 'ledger',
  WALLET_CONNECT = 'walletconnect',
  EXTENSION = 'extension',
  EXPLORE = 'explore'
}

export interface Session {
  sessionType: SessionType;
  address: string;
}
