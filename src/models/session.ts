export enum SessionType {
  KEPLR = 'keplr',
  LOCAL = 'local',
  LEDGER = 'ledger',
  EXTENSION = 'extension',
  EXPLORE = 'explore'
}

export interface Session {
  sessionType: SessionType;
  address: string;
}
