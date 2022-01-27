import { external } from 'src/boot/axios';
import { FaucetRequest, FaucetResponse, FaucetTransferStatus } from 'src/models';
import Store from 'src/store';

export const getFaucet = async (request: FaucetRequest) => {
  const faucetURL = Store.state.authentication.network.faucetURL;

  if (faucetURL) {
    try {
      const { data: result } = await external.post<FaucetResponse>(faucetURL, request);

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.transfers.length > 0) {
        const transferError = result.transfers.find(el => el.status === FaucetTransferStatus.ERROR);

        if (transferError) {
          throw new Error(transferError.error);
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  return null;
}
