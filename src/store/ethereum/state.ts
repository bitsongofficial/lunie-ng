import { BigNumber } from 'bignumber.js';
import { Transaction } from 'src/models';

export interface EthereumStateInterface {
  mustApprove: boolean;
  approveLoading: boolean;
  depositLoading: boolean;
  pendingTransactions: Transaction[]; // Ethereum Txs
  bridgeTransactions: Transaction[]; // Bridge Txs
  address: string | null;
  balance: BigNumber;
  chainId: string | null;
  loadingMetamask: boolean;
  loadingAllowance: boolean;
};

function state (): EthereumStateInterface {
  return {
    mustApprove: false,
    approveLoading: false,
    depositLoading: false,
    pendingTransactions: [],
    bridgeTransactions: [],
    address: null,
    balance: new BigNumber(0),
    chainId: null,
    loadingMetamask: false,
    loadingAllowance: false
  }
};

export default state;
