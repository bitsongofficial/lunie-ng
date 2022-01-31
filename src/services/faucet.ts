import { external } from 'src/boot/axios';
import { FaucetRequest, FaucetResponse } from 'src/models';
import Store from 'src/store';

export const getFaucet = async (request: FaucetRequest) => {
  const faucetURL = Store.state.authentication.network.faucetURL;

  if (faucetURL) {
    try {
      const { data: result } = await external.get<FaucetResponse>(faucetURL, { params: request });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.status === 'error') {
        throw new Error('Faucet get error, try later');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  return null;
}
