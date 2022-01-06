import { Validator, ValidatorStatus } from './validators';
import { Coin } from '@cosmjs/stargate';
import { PaginationResponse } from './balances';
import { BigNumber } from 'bignumber.js';

export interface UnbondingDelegation {
  id: string;
  delegatorAddress: string;
  validator: Validator;
  amount: string | number | BigNumber;
  startHeight: string;
  endTime: string;
}

export interface UnbondingDelegationEntry {
  creation_height: string;
  completion_time: string;
  initial_balance: string;
  balance: string;
}

export interface UnbondingDelegationFlat extends UnbondingDelegationEntry {
  delegator_address: string;
  validator_address: string;
}

export interface UnbondingDelegationRaw {
  delegator_address: string;
  validator_address: string;
  entries: UnbondingDelegationEntry[];
}

export interface Delegation {
  id: string;
  validatorAddress: string;
  delegatorAddress: string;
  validator: Validator;
  amount: string | number | BigNumber;
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

export interface ValidatorsDelegationResponse {
  delegation_response: DelegationWithBalance;
}

export interface StakingDelegationResponse extends PaginationResponse {
  result: DelegationWithBalance[];
}

export interface UnbondingDelegationResponse extends PaginationResponse {
  unbonding_responses: UnbondingDelegationRaw[];
}
