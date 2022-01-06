import { Delegation, UnbondingDelegation } from './delegations';
import { BondStatus } from '@cosmjs/launchpad/build/lcdapi/staking';
import { BigNumber } from 'bignumber.js';
import { Dictionary } from 'lodash';

export enum ValidatorStatusRequest {
  BOND_STATUS_BONDED = 'BOND_STATUS_BONDED',
  BOND_STATUS_UNBONDING = 'BOND_STATUS_UNBONDING',
  BOND_STATUS_UNBONDED = 'BOND_STATUS_UNBONDED',
  BOND_STATUS_UNSPECIFIED = 'BOND_STATUS_UNSPECIFIED'
}

export enum ValidatorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Validator {
  id: string;
  operatorAddress: string;
  consensusPubkey: string;
  jailed: boolean;
  details: string;
  website: string;
  identity: string;
  picture?: string;
  name: string;
  votingPower: string | number;
  startHeight?: string;
  uptimePercentage: number;
  tokens: string | number | BigNumber;
  commissionUpdateTime: string;
  commission: string;
  maxCommission: string;
  maxChangeCommission: string;
  status: ValidatorStatus,
  statusDetailed: string;
  expectedReturns?: BigNumber;
  delegation?: Delegation;
  undelegation?: UnbondingDelegation;
}

export interface TopVoterValidator {
  name: string;
  address: string;
  votingPower: string | number;
  picture?: string;
  validator: Validator;
}

export interface ValidatorRaw {
  readonly operator_address: string;
  readonly consensus_pubkey: string;
  readonly jailed: boolean;
  readonly status: BondStatus;
  readonly tokens: string;
  readonly delegator_shares: string;
  readonly description: {
    readonly moniker: string;
    readonly identity: string;
    readonly website: string;
    readonly security_contact: string;
    readonly details: string;
  };
  readonly unbonding_height: string;
  readonly unbonding_time: string;
  readonly commission: {
    readonly commission_rates: {
      readonly rate: string;
      readonly max_rate: string;
      readonly max_change_rate: string;
    };
    readonly update_time: string;
  };
  readonly min_self_delegation: string;
  readonly signing_info?: SignerInfo;
}

export interface ValidatorResponse {
  height: string;
  result: ValidatorRaw[];
}

export interface SignerInfo {
  address: string;
  start_height: string;
  index_offset: string;
  jailed_until: string;
  tombstoned: boolean;
  missed_blocks_counter: string;
}

export type ValidatorMap = Dictionary<Validator>;
