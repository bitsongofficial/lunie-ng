import BigNumber from 'bignumber.js'
import {
  MsgDelegate,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx'
import { MsgDeposit, MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx'
import Long from 'long'

// Bank

/* istanbul ignore next */
export function SendTx(senderAddress, { to, amounts }, network) {
  return {
    typeUrl: `/cosmos.bank.v1beta1.MsgSend`,
    value: {
      fromAddress: senderAddress,
      toAddress: to[0],
      amount: amounts.map((amount) => Coin(amount, network.coinLookup)),
    },
  }
}

// Staking
export function StakeTx(senderAddress, { to, amount }, network) {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: MsgDelegate.fromPartial({
      delegatorAddress: senderAddress,
      validatorAddress: to[0],
      amount: Coin(amount, network.coinLookup),
    }),
  }
}

export function UnstakeTx(senderAddress, { from, amount }, network) {
  return {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: MsgUndelegate.fromPartial({
      delegatorAddress: senderAddress,
      validatorAddress: from[0],
      amount: Coin(amount, network.coinLookup),
    }),
  }
}

export function ClaimRewardsTx(
  senderAddress,
  {
    // amounts,
    from,
  }
) {
  /* istanbul ignore next */
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
  /* istanbul ignore next */
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
  /* istanbul ignore next */
  return {
    typeUrl: '/cosmos.gov.v1beta1.MsgDeposit',
    value: MsgDeposit.fromPartial({
      depositor: senderAddress,
      proposalId: Long.fromNumber(proposalId),
      amount: [Coin(amount, network.coinLookup)],
    }),
  }
}

export function Coin({ amount, denom }, coinLookup) {
  const lookup = coinLookup.find(({ viewDenom }) => viewDenom === denom)
  return {
    amount: BigNumber(amount)
      .dividedBy(lookup.chainToViewConversionFactor)
      .toFixed(),
    denom: lookup.chainDenom,
  }
}

export default {
  SendTx,
  StakeTx,
  UnstakeTx,
  ClaimRewardsTx,
  VoteTx,
  DepositTx,
}
