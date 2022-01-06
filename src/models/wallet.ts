import Transport from '@ledgerhq/hw-transport';
import { Coin } from '@cosmjs/stargate';
import { NetworkConfig } from './network';
import { Validator } from './validators';
import { SessionType } from './session';
import { AccountInfo } from './account';

export enum MessageTypes {
  SEND = 'SendTx',
  STAKE = 'StakeTx',
  RESTAKE = 'RestakeTx',
  UNSTAKE = 'UnstakeTx',
  VOTE = 'VoteTx',
  DEPOSIT = 'DepositTx',
  CLAIM_REWARDS = 'ClaimRewardsTx',
  SUBMIT_PROPOSAL = 'SubmitProposalTx',
  UNKNOWN = 'UnknownTx',
};

export interface Wallet {
  name: string;
  address: string;
  wallet?: string;
  HDPath: string;
}

export interface WalletSignData {
  address: string;
  password: string;
}

export interface TransactionRequest {
  type: MessageTypes;
  memo?: string;
  password?: string;
  to?: Validator;
  from?: Validator;
  amounts: Coin[];
  amount: Coin;
}

export interface SignBroadcastRequest {
  messageType: MessageTypes;
  message: TransactionRequest;
  senderAddress: string;
  accountInfo: AccountInfo;
  network: NetworkConfig;
  signingType: SessionType,
  password: string;
  HDPath: string;
  feeDenom: string;
  chainId: string;
  memo: string;
  ledgerTransport?: Transport<string>
}

export interface SignMessageRequest {
  typeUrl: string;
  value: {
      validatorSrcAddress?: string | undefined;
      validatorDstAddress?: string | undefined;
      delegatorAddress?: string;
      validatorAddress?: string | undefined;
      fromAddress?: string;
      toAddress?: string | undefined;
      amount?: {
        amount: string;
        denom: string;
      } | ({
          amount: string;
          denom: string;
      } | undefined)[];
  };
}
