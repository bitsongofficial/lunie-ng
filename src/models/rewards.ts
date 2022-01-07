import { Validator } from './validators';
import { Coin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';

export interface BalanceCoin {
  supported?: boolean;
  amount: string | number | BigNumber;
  denom: string;
  sourceChain?: string;
}

export interface Reward {
  id: string;
  denom: string;
  amount: string | number | BigNumber;
  validator: Validator;
}

export interface ValidatorWithReward {
  validator: string;
  totalRewardAmount: number;
}

export interface RewardWithAddress {
  validator_address: string;
  reward: Coin[];
}

export interface RewardsResponse {
  rewards: RewardWithAddress[];
  total: Coin[];
}
