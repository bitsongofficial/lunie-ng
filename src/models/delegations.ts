import { Validator, ValidatorStatus } from './validators';
import { Coin } from '@cosmjs/stargate';
import { PaginationResponse } from './balances';

export interface Delegation {
  id: string;
  validatorAddress: string;
  delegatorAddress: string;
  validator: Validator;
  amount: string | number;
  active: ValidatorStatus;
}

export interface DelegationRaw {
  delegator_address: string;
  validator_address: string;
  shares: string;
}

export interface DelegationWithBalance {
  delegation: DelegationRaw;
  balance: Coin;
}

export interface DelegationResponse extends PaginationResponse {
  delegation_responses: DelegationWithBalance[];
}
