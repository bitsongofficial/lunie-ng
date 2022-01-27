import { IssueFantokenRequest } from './fantoken';
import Transport from '@ledgerhq/hw-transport';
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDeposit, MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
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
  ISSUE_FANTOKEN = 'IssueFantokenTx',
  MINT_FANTOKEN = 'MintFantokenTx',
  BURN_FANTOKEN = 'BurnFantokenTx',
  CHANGE_OWNER_FANTOKEN = 'ChangeOwnerFantokenTx',
  DISABLE_MINT_FANTOKEN = 'DisableMintFantokenTx',
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
  proposalId?: string;
  voteOption?: number;
  password?: string;
  to?: string;
  from?: Validator;
  froms?: string[];
  amounts?: Coin[];
  amount: Coin;
}

export interface TransactionBitsongRequest extends Partial<IssueFantokenRequest> {
  memo?: string;
  password?: string;
  to?: string;
  amount?: string;
  denom?: string;
  mintable?: boolean;
}

export interface TransactionBitsongRequestWithType {
  type: MessageTypes;
  message: TransactionBitsongRequest;
  memo?: string;
}

export interface BitsongSignBroadcastRequest {
  messageType: MessageTypes;
  message: TransactionBitsongRequest;
  senderAddress: string;
  accountInfo: AccountInfo;
  network: NetworkConfig;
  signingType: SessionType;
  HDPath: string;
  feeDenom: string;
  chainId: string;
  memo: string;
  ledgerTransport?: Transport
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
  ledgerTransport?: Transport
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
  } | MsgWithdrawDelegatorReward | MsgVote | MsgDeposit;
}
