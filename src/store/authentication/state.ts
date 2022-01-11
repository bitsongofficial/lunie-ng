import { network } from 'src/constants';
import { Session, NetworkConfig } from 'src/models';

export interface AuthenticationStateInterface {
  session: Session | undefined;
  network: NetworkConfig;
  loading: boolean;
  changing: boolean;
}

function state (): AuthenticationStateInterface {
  return {
    session: undefined,
    network,
    loading: false,
    changing: false
  };
}

export default state;
