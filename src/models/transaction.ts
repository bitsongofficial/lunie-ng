export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export interface Transaction {
  hash: string;
  status: TransactionStatus;
  time: number;
  to: string;
}
