import { Transaction, TransactionStatus, TransactionType, TransactionWithRelated } from 'src/models';
import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { EthereumStateInterface } from './state';

const getters: GetterTree<EthereumStateInterface, StateInterface> = {
  mustApprove(state) {
    return state.mustApprove;
  },
  approveLoading(state) {
    return state.approveLoading;
  },
  depositLoading(state) {
    return state.depositLoading;
  },
  pendingTransactions({ pendingTransactions, bridgeTransactions, address }): TransactionWithRelated[] {
    return pendingTransactions.filter(el => el.sender === address).map(tx => {
      const related: Transaction[] = [];
      const bridgeTx = bridgeTransactions.find(el => el.hash === tx.hash);

      related.push(tx);

      if (bridgeTx) {
        related.push(bridgeTx);
      } else if (tx.type === TransactionType.DEPOSIT) {
        related.push({
          id: Date.now(),
          hash: '',
          status: TransactionStatus.PENDING,
          time: Date.now(),
          to: '',
          sender: '',
          type: TransactionType.COSMOS
        });
      }

      const pendingRelated = related.filter(el => el.status === TransactionStatus.PENDING);

      return ({
        ...tx,
        status: pendingRelated.length > 0 || (related.length < 2 && tx.type === TransactionType.DEPOSIT)  ? TransactionStatus.PENDING : tx.status,
        related
      });
    });
  },
  address(state) {
    return state.address;
  },
  balance(state) {
    return state.balance;
  },
};

export default getters;
