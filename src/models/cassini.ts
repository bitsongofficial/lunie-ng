export enum CassiniTxStatus {
  Error = 'Error',
  Processing = 'Processing',
  Invalid = 'Invalid',
  Completed = 'Completed',
  Waiting = 'Waiting Confirmation'
}

export interface CassiniTx {
  id: number;
  height: number;
  hash: string;
  from: string;
  to: string;
  amount: string;
  migrated_amount: string;
  fee: string;
  status: CassiniTxStatus;
  cosmos_nonce: number;
  cosmos_hash: string;
  created_at: string;
}

export interface CassiniResponse<T> {
  success: boolean;
  data: T;
}
