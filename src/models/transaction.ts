import { CassiniTx } from './cassini';

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum TransactionType {
  APPROVE = 'Approve',
  DEPOSIT = 'Migrate',
  COSMOS = 'Cosmos'
}

export interface Transaction {
  id: number;
  hash: string;
  cosmosHash?: string;
  status: TransactionStatus;
  time: number;
  to: string;
  sender: string;
  type: TransactionType;
  amount?: string;
  meta?: CassiniTx;
}

export interface TransactionWithRelated extends Transaction {
  related: Transaction[];
}
