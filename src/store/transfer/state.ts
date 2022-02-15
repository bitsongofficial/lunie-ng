export interface TransferStateInterface {
  sending: boolean;
}

function state(): TransferStateInterface {
  return {
    sending: false
  }
};

export default state;
