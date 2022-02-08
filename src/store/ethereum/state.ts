import { BigNumber } from 'bignumber.js';
import { Transaction } from 'src/models';

export interface EthereumStateInterface {
  mustApprove: boolean;
  approveLoading: boolean;
  depositLoading: boolean;
  pendingTransactions: Transaction[];
  address: string | null;
  balance: BigNumber;
  chainId: string | null;
  loadingMetamask: boolean;
};

function state (): EthereumStateInterface {
  return {
    mustApprove: true,
    approveLoading: false,
    depositLoading: false,
    pendingTransactions: [],
    address: null,
    balance: new BigNumber(0),
    chainId: null,
    loadingMetamask: false
  }
};

export default state;
