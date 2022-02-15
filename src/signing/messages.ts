import { Coin as StargateCoin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';
import {
  MsgDelegate,
  MsgUndelegate,
  MsgBeginRedelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDeposit, MsgVote, MsgSubmitProposal } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import Long from 'long';
import { CoinLookUp, NetworkConfig, TransactionRequest, SignMessageRequest } from 'src/models';
import { TextProposal } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

// Bank
export const SendTx = (senderAddress: string, { to, amounts }: TransactionRequest, network: NetworkConfig): SignMessageRequest => {
  return {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: senderAddress,
      toAddress: to,
      amount: amounts ? amounts.map((amount) => Coin(amount, network.coinLookup)) : [],
    },
  }
}

// Staking
export const StakeTx = (senderAddress: string, { to, amount }: TransactionRequest, network: NetworkConfig): SignMessageRequest => {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: MsgDelegate.fromPartial({
      delegatorAddress: senderAddress,
      validatorAddress: to,
      amount: Coin(amount, network.coinLookup),
    }),
  };
}

export const RestakeTx = (senderAddress: string, { from, to, amount }: TransactionRequest, network: NetworkConfig): SignMessageRequest => {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    value: MsgBeginRedelegate.fromPartial({
      delegatorAddress: senderAddress,
      validatorSrcAddress: from?.operatorAddress,
      validatorDstAddress: to,
      amount: Coin(amount, network.coinLookup),
    }),
  };
}

export const UnstakeTx = (senderAddress: string, { from, amount }: TransactionRequest, network: NetworkConfig): SignMessageRequest => {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: MsgUndelegate.fromPartial({
      delegatorAddress: senderAddress,
      validatorAddress: from?.operatorAddress,
      amount: Coin(amount, network.coinLookup),
    }),
  };
}

export const ClaimRewardsTx = (senderAddress: string, { froms }: TransactionRequest): SignMessageRequest[] => {
  return froms ? froms.map((valAddr) => ({
    typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    value: MsgWithdrawDelegatorReward.fromPartial({
      delegatorAddress: senderAddress,
      validatorAddress: valAddr,
    }),
  })) : [];
}

export const VoteTx = (senderAddress: string, { proposalId, voteOption }: TransactionRequest): SignMessageRequest | undefined => {
  if (proposalId !== undefined && voteOption) {
    return {
      typeUrl: '/cosmos.gov.v1beta1.MsgVote',
      value: MsgVote.fromPartial({
        voter: senderAddress,
        proposalId: Long.fromString(proposalId),
        option: voteOption,
      }),
    };
  }
}

export const DepositTx = (senderAddress: string, { proposalId, amount }: TransactionRequest, network: NetworkConfig): SignMessageRequest | undefined => {
  const coin = Coin(amount, network.coinLookup);

  if (proposalId !== undefined && coin) {
    return {
      typeUrl: '/cosmos.gov.v1beta1.MsgDeposit',
      value: MsgDeposit.fromPartial({
        depositor: senderAddress,
        proposalId: Long.fromString(proposalId),
        amount: [coin]
      }),
    };
  }
}

// Gov
export const SubmitProposalTx = (senderAddress: string, { deposit, title, description }: TransactionRequest, network: NetworkConfig): SignMessageRequest | undefined => {
  if (deposit) {
    const coin = Coin(deposit, network.coinLookup);

    if (coin && title && description) {
      const proposal = TextProposal.fromPartial({
        title,
        description
      });

      return {
        typeUrl: '/cosmos.gov.v1beta1.MsgSubmitProposal',
        value: MsgSubmitProposal.fromPartial({
          content: {
            typeUrl: '/cosmos.gov.v1beta1.TextProposal',
            value: TextProposal.encode(proposal).finish()
          },
          initialDeposit: [coin],
          proposer: senderAddress,
        })
      };
    }
  }
}

export function Coin({ amount, denom }: StargateCoin, coinLookup: CoinLookUp[]) {
  const lookup = coinLookup.find(({ viewDenom }) => viewDenom === denom);

  if (lookup) {
    return {
      amount: new BigNumber(amount)
        .dividedBy(lookup.chainToViewConversionFactor)
        .toFixed(),
      denom: lookup.chainDenom,
    };
  } else {
    return {
      amount: new BigNumber(amount)
        .dividedBy('1e-6')
        .toFixed(),
      denom
    };
  }
}

export default {
  SendTx,
  StakeTx,
  UnstakeTx,
  RestakeTx,
  ClaimRewardsTx,
  VoteTx,
  DepositTx
};
