import { MessageTypes, SignBroadcastRequest, SignMessageRequest } from 'src/models';
import { getNetworkFee } from 'src/common/fees';
import { BigNumber } from 'bignumber.js';
import { coins } from '@cosmjs/amino';
import {
  SigningStargateClient,
  assertIsBroadcastTxSuccess,
} from '@cosmjs/stargate';
import { getSigner } from './signer';
import { SendTx, RestakeTx, StakeTx, UnstakeTx, VoteTx, DepositTx, ClaimRewardsTx, SubmitProposalTx } from './messages';
import { getCoinLookup } from 'src/common/network';
import Store from 'src/store';

export const getFees = (transactionType: string, feeDenom: string) => {
  const { gasEstimate, feeOptions } = getNetworkFee(transactionType)
  const fee = feeOptions.find(({ denom }) => denom === feeDenom);

  if (fee) {
    const coinLookup = getCoinLookup(fee.denom, 'viewDenom');

    if (coinLookup) {
      // converting view fee to on chain fee
      const convertedFee = [
        {
          amount: new BigNumber(fee.amount)
            .div(coinLookup.chainToViewConversionFactor)
            .toString(),
          denom: coinLookup.chainDenom,
        },
      ];

      return {
        gasEstimate: String(gasEstimate),
        fee: convertedFee,
      };
    }
  }
}

export const createSignBroadcast = async ({
  messageType,
  message,
  senderAddress,
  accountInfo,
  signingType,
  password,
  feeDenom,
  chainId,
  memo,
  ledgerTransport,
}: SignBroadcastRequest) => {
  const feeData = getFees(messageType, feeDenom);

  const transactionData = {
    ...feeData,
    memo,
    chainId,
    accountNumber: accountInfo.accountNumber,
    accountSequence: accountInfo.sequence,
  };

  const signer = await getSigner(
    signingType,
    {
      address: senderAddress,
      password,
    },
    chainId,
    ledgerTransport
  );

  let messages: SignMessageRequest[] = [];

  switch(messageType) {
    case MessageTypes.SEND:
      messages.push(SendTx(senderAddress, message, Store.state.authentication.network));
      break;
    case MessageTypes.STAKE:
      messages.push(StakeTx(senderAddress, message, Store.state.authentication.network));
      break;
    case MessageTypes.UNSTAKE:
      messages.push(UnstakeTx(senderAddress, message, Store.state.authentication.network));
      break;
    case MessageTypes.RESTAKE:
      messages.push(RestakeTx(senderAddress, message, Store.state.authentication.network));
      break;
    case MessageTypes.VOTE:
      const vote = VoteTx(senderAddress, message);

      if (vote) {
        messages.push(vote);
      }

      break;
    case MessageTypes.DEPOSIT:
      const deposit = DepositTx(senderAddress, message, Store.state.authentication.network);

      if (deposit) {
        messages.push(deposit);
      }

      break;
    case MessageTypes.CLAIM_REWARDS:
      const rewards = ClaimRewardsTx(senderAddress, message);
      messages = [...rewards];
      break;
    case MessageTypes.SUBMIT_PROPOSAL:
      const proposal = SubmitProposalTx(senderAddress, message, Store.state.authentication.network);

      if (proposal) {
        messages.push(proposal);
      }

      break;
  }

  const stdFee = {
    amount: coins(
      Number(transactionData.fee ? transactionData.fee[0].amount : 0),
      transactionData.fee ? transactionData.fee[0].denom : Store.state.authentication.network.stakingDenom
    ),
    gas: transactionData.gasEstimate || '350000',
  };

  const client = await SigningStargateClient.connectWithSigner(
    Store.state.authentication.network.rpcURL,
    signer
  );

  const txResult = await client.signAndBroadcast(
    senderAddress,
    messages,
    stdFee,
    memo || ''
  );

  assertIsBroadcastTxSuccess(txResult);

  return {
    hash: txResult.transactionHash,
  };
}

export const pollTxInclusion = async (txHash: string, iteration = 0): Promise<unknown> => {
  const MAX_POLL_ITERATIONS = 30;
  let txFound = false;

  try {
    await fetch(`${Store.state.authentication.network.apiURL}/txs/${txHash}`).then((res) => {
      if (res.status === 200) {
        txFound = true
      }
    });
  } catch (err) {
    // ignore error
  }

  if (txFound) {
    return true;
  } else if (iteration < MAX_POLL_ITERATIONS) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return pollTxInclusion(txHash, iteration + 1);
  } else {
    throw new Error(
      `The transaction wasn't included in time. Check explorers for the transaction hash ${txHash}.`
    );
  }
}

