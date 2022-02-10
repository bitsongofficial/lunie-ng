import { NetworkConfig } from './network';

export enum IBCStatus {
  SUCCESS = 'success',
  FAIL = 'fail',
  PENDING = 'pending'
}

export interface IBCTransfer {
  hash: string;
  sequence: string;
  type: string;
  amount: number;
  status: IBCStatus | string;
}

export interface IBCTransferRequest {
  from?: Partial<NetworkConfig>;
  to?: Partial<NetworkConfig>;
  toAddress: string;
  fromAddress: string;
  amount: string;
}
