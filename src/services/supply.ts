import { external } from 'src/boot/axios';
import { SupplyResponse } from 'src/models';
import Store from 'src/store';

export const getSupplyInfo = async () => {
  const supplyURL = Store.state.authentication.network.supplyURL;

  if (supplyURL) {
    const { data: result } = await external.get<SupplyResponse>(supplyURL);

    return result;
  }

  return null;
}
