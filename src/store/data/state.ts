import { BlockReduced } from 'src/models';

export interface DataStateInterface {
  block: BlockReduced | undefined;
}

function state (): DataStateInterface {
  return {
    block: undefined,
  }
}

export default state;
