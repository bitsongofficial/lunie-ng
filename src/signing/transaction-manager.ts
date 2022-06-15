import { BitsongSignBroadcastRequest, MessageTypes, SignBroadcastRequest, SignMessageRequest } from 'src/models';
import { getNetworkFee } from 'src/common/fees';
import { BigNumber } from 'bignumber.js';
import { coins } from '@cosmjs/amino';
import { assertIsDeliverTxSuccess, SigningStargateClient } from '@cosmjs/stargate';
import { getSigner } from './signer';
import { SendTx, RestakeTx, StakeTx, UnstakeTx, VoteTx, DepositTx, ClaimRewardsTx, SubmitProposalTx } from './messages';
import { getCoinLookup } from 'src/common/network';
import { SigningBitsongClient, Constants } from '@bitsongjs/sdk';

import Store from 'src/store';
import { DeliverTxResponse } from '@cosmjs/stargate';
import { walletConnect } from 'src/services';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';

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

  assertIsDeliverTxSuccess(txResult);

  return {
    hash: txResult.transactionHash,
  };
}

export const createSignWalletConnect = async ({
  messageType,
  message,
  senderAddress,
}: SignBroadcastRequest) => {
  const messages: SignMessageRequest[] = [];

  switch(messageType) {
    case MessageTypes.SEND:
      const sendTx = SendTx(senderAddress, message, Store.state.authentication.network);
      const send = sendTx.value as MsgSend

      messages.push({
        ...sendTx,
        value: {
          ...sendTx.value,
          amount: send.amount[0],
        }
      });

      break;
  }

  const res = await walletConnect.sendCustomRequest({
    method: 'sign_tx',
    params: messages,
  }) as Record<string, unknown>;

  console.log(res);

  return {
    hash: 'ciao',
  };
}

export const createBitsongSignBroadcast = async ({
  messageType,
  message,
  senderAddress,
  signingType,
  chainId,
  memo,
  ledgerTransport,
}: BitsongSignBroadcastRequest) => {
  try {
    const signer = await getSigner(
      signingType,
      {
        address: senderAddress,
        password: '',
      },
      chainId,
      ledgerTransport
    );

    const defaultFee = {
      amount: [
        {
          denom: Constants.MicroDenom,
          amount: '2000',
        },
      ],
      gas: '180000', // 180k
    };

    const defaultIssueFee = {
      denom: Constants.MicroDenom,
      amount: '1000000',
    };

    const params = Store.state.fantoken.params;
    let issueFee;

    if (params) {
      issueFee = {
        denom: params.issue_price.denom,
        amount: params.issue_price.amount
      };
    }

    const signingBitsong = await SigningBitsongClient.connectWithSigner(
      Store.state.authentication.network.rpcURL,
      signer
    );

    let txResult: DeliverTxResponse | undefined = undefined;

    const amount = new BigNumber(message.amount ? message.amount : '0')
      .div(1e-6)
      .toString();

    switch(messageType) {
      case MessageTypes.ISSUE_FANTOKEN:
        const maxSupply = new BigNumber(message.maxSupply ? message.maxSupply : '0')
        .div(1e-6)
        .toString();

        txResult = await signingBitsong.issueFanToken(
          message.symbol ?? '',
          message.name ?? '',
          maxSupply,
          message.description ?? '',
          senderAddress,
          issueFee ?? defaultIssueFee,
          defaultFee,
          memo
        );
        break;
      case MessageTypes.MINT_FANTOKEN:
        txResult = await signingBitsong.mintFanToken(
          message.to ?? '',
          message.denom ?? '',
          amount,
          senderAddress,
          defaultFee,
          memo
        );
        break;
      case MessageTypes.BURN_FANTOKEN:
        txResult = await signingBitsong.burnFanToken(
          message.denom ?? '',
          amount,
          senderAddress,
          defaultFee,
          memo
        );
        break;
      case MessageTypes.DISABLE_MINT_FANTOKEN:
        txResult = await signingBitsong.editFanToken(
          message.denom ?? '',
          message.mintable ? true : false,
          senderAddress,
          defaultFee,
          memo
        );
        break;
      case MessageTypes.CHANGE_OWNER_FANTOKEN:
        txResult = await signingBitsong.transferFanTokenOwner(
          message.denom ?? '',
          senderAddress,
          message.to ?? '',
          defaultFee,
          memo
        );
        break;
    }

    if (txResult) {
      assertIsDeliverTxSuccess(txResult);

      return {
        hash: txResult.transactionHash,
      };
    }
  } catch (error) {
    throw error;
  }
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

