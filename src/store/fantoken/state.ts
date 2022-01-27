import { FantokenParams, FanTokenWithStats } from 'src/models';

export interface FantokenStateInterface {
  loading: boolean;
  fantokens: FanTokenWithStats[];
  params: FantokenParams | null;
}

function state (): FantokenStateInterface {
  return {
    loading: false,
    fantokens: [],
    params: null
  };
}

export default state;
