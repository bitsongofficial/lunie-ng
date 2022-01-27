export interface FaucetRequest {
  address: string;
  coins: string[];
}

export enum FaucetTransferStatus {
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface FaucetTransfer {
  coin: string;
  status: FaucetTransferStatus;
  error?: string;
}

export interface FaucetResponse {
  transfers: FaucetTransfer[];
  error?: string;
}
