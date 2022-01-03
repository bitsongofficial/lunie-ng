import { Session } from 'src/models';

export interface AuthenticationStateInterface {
  session: Session | undefined;
}

function state (): AuthenticationStateInterface {
  return {
    session: undefined,
  }
}

export default state;
