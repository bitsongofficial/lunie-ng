import { Coin as StargateCoin } from '@cosmjs/stargate';
import { BigNumber } from 'bignumber.js';
import {
  MsgDelegate,
  MsgUndelegate,
  MsgBeginRedelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx';
/* import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDeposit, MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import Long from 'long'; */
import { CoinLookUp, NetworkConfig, TransactionRequest, SignMessageRequest } from 'src/models';

// Bank
export function SendTx(senderAddress: string, { to, amounts }: TransactionRequest, network: NetworkConfig): SignMessageRequest {
  return {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: senderAddress,
      toAddress: to?.operatorAddress,
      amount: amounts.map((amount) => Coin(amount, network.coinLookup)),
    },
  }
}

// Staking
export function StakeTx(senderAddress: string, { to, amount }: TransactionRequest, network: NetworkConfig): SignMessageRequest {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: MsgDelegate.fromPartial({
      delegatorAddress: senderAddress,
      validatorAddress: to?.operatorAddress,
      amount: Coin(amount, network.coinLookup),
    }),
  };
}

export function RestakeTx(senderAddress: string, { from, to, amount }: TransactionRequest, network: NetworkConfig): SignMessageRequest {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgBeginRedelegate',
    value: MsgBeginRedelegate.fromPartial({
      delegatorAddress: senderAddress,
      validatorSrcAddress: from?.operatorAddress,
      validatorDstAddress: to?.operatorAddress,
      amount: Coin(amount, network.coinLookup),
    }),
  };
}

export function UnstakeTx(senderAddress: string, { from, amount }: TransactionRequest, network: NetworkConfig): SignMessageRequest {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: MsgUndelegate.fromPartial({
      delegatorAddress: senderAddress,
      validatorAddress: from?.operatorAddress,
      amount: Coin(amount, network.coinLookup),
    }),
  };
}

/* export function ClaimRewardsTx(
  senderAddress,
  {
    // amounts,
    from,
  }
) {
  return from.map((valAddr) => ({
    typeUrl: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
    value: MsgWithdrawDelegatorReward.fromPartial({
      delegatorAddress: senderAddress,
      validatorAddress: valAddr,
    }),
  }))
}

export function VoteTx(senderAddress, { proposalId, voteOption }) {
  const chainVoteOption = {
    Yes: 1,
    Abstain: 2,
    No: 3,
    NoWithVeto: 4,
  }[voteOption]
  return {
    typeUrl: '/cosmos.gov.v1beta1.MsgVote',
    value: MsgVote.fromPartial({
      voter: senderAddress,
      proposalId: Long.fromNumber(proposalId),
      option: chainVoteOption,
    }),
  }
}

export function DepositTx(senderAddress, { proposalId, amount }, network) {
  return {
    typeUrl: '/cosmos.gov.v1beta1.MsgDeposit',
    value: MsgDeposit.fromPartial({
      depositor: senderAddress,
      proposalId: Long.fromNumber(proposalId),
      amount: [Coin(amount, network.coinLookup)],
    }),
  }
}
*/
export function Coin({ amount, denom }: StargateCoin, coinLookup: CoinLookUp[]) {
  const lookup = coinLookup.find(({ viewDenom }) => viewDenom === denom);

  if (lookup) {
    return {
      amount: new BigNumber(amount)
        .dividedBy(lookup.chainToViewConversionFactor)
        .toFixed(),
      denom: lookup.chainDenom,
    };
  }
}

export default {
  SendTx,
  StakeTx,
  UnstakeTx,
  RestakeTx,
  /* ClaimRewardsTx,
  VoteTx,
  DepositTx, */
};
