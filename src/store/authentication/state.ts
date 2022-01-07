import { network } from 'src/constants';
import { Session, NetworkConfig } from 'src/models';

export interface AuthenticationStateInterface {
  session: Session | undefined;
  network: NetworkConfig;
}

function state (): AuthenticationStateInterface {
  return {
    session: undefined,
    network,
  }
}

export default state;
