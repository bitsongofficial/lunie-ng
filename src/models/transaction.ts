export enum TranscationStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface Transaction {
  hash: string;
  status: TranscationStatus;
  time: number;
  to: string;
}
