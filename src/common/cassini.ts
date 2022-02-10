import { CassiniTxStatus, TransactionStatus } from 'src/models';

export const cassiniStatusConverter = (status: CassiniTxStatus) => {
  switch (status) {
    case CassiniTxStatus.Completed:
      return TransactionStatus.SUCCESS;
    case CassiniTxStatus.Error:
    case CassiniTxStatus.Invalid:
      return TransactionStatus.FAILED;
    case CassiniTxStatus.Processing:
    case CassiniTxStatus.Waiting:
      return TransactionStatus.PENDING;
    default:
      return TransactionStatus.PENDING;
  }
}
