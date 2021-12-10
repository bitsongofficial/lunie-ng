import BigNumber from 'bignumber.js'
import { coins, encodeSecp256k1Pubkey } from '@cosmjs/amino'
import {
  SigningStargateClient,
  assertIsBroadcastTxSuccess,
  defaultRegistryTypes,
} from '@cosmjs/stargate'
import {
  isOfflineDirectSigner,
  encodePubkey,
  Registry,
  makeAuthInfoBytes,
} from '@cosmjs/proto-signing'
import { fromBase64 } from '@cosmjs/encoding'
import { Int53 } from '@cosmjs/math'
import { TxRaw, TxBody, SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { getSigner } from './signer'
import messageCreators from './messages.js'
import fees from '~/common/fees'
import network from '~/common/network'

export function getFees(transactionType, feeDenom) {
  const { gasEstimate, feeOptions } = fees.getFees(transactionType)
  const fee = feeOptions.find(({ denom }) => denom === feeDenom)
  const coinLookup = network.getCoinLookup(fee.denom, 'viewDenom')
  // converting view fee to on chain fee
  const convertedFee = [
    {
      amount: BigNumber(fee.amount)
        .div(coinLookup.chainToViewConversionFactor)
        .toString(),
      denom: coinLookup.chainDenom,
    },
  ]
  return {
    gasEstimate: String(gasEstimate),
    fee: convertedFee,
  }
}

export async function createSignBroadcast({
  messageType,
  message,
  senderAddress,
  accountInfo,
  network,
  signingType,
  password,
  HDPath,
  feeDenom,
  chainId,
  memo,
  ledgerTransport,
}) {
  const feeData = getFees(messageType, feeDenom)
  const transactionData = {
    ...feeData,
    memo,
    chainId,
    accountNumber: accountInfo.accountNumber,
    accountSequence: accountInfo.sequence,
  }

  console.log('transactionData', transactionData)

  let messages = messageCreators[messageType](senderAddress, message, network)
  console.log('messages', messages)

  if (messages.length === undefined) {
    messages = [messages]
  }

  const signer = await getSigner(
    signingType,
    {
      address: senderAddress,
      password,
    },
    chainId,
    ledgerTransport
  )

  console.log('isOfflineDirectSigner', isOfflineDirectSigner(signer))

  const accountFromSigner = (await signer.getAccounts()).find(
    (account) => account.address === senderAddress
  )
  console.log('accountFromSigner', accountFromSigner)

  if (!accountFromSigner) {
    throw new Error('Failed to retrieve account from signer')
  }

  const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey))

  const txBodyEncodeObject = {
    typeUrl: '/cosmos.tx.v1beta1.TxBody',
    value: {
      messages,
      memo,
    },
  }

  const registry = new Registry(defaultRegistryTypes)

  const txBodyBytes = registry.encode(txBodyEncodeObject)

  const stdFee = {
    amount: coins(
      Number(transactionData.fee[0].amount),
      transactionData.fee[0].denom
    ),
    gas: transactionData.gasEstimate,
  }

  const client = await SigningStargateClient.connectWithSigner(
    network.rpcURL,
    signer
  )

  const signerData = {
    accountNumber: Number(transactionData.accountNumber),
    sequence: Number(transactionData.accountSequence),
    chainId,
  }
  console.log('signerData', signerData)

  const gasLimit = Int53.fromString(stdFee.gas).toNumber()
  const authInfoBytes = makeAuthInfoBytes(
    [{ pubkey, sequence: signerData.sequence }],
    stdFee.amount,
    gasLimit
  )

  const signDocRaw = SignDoc.fromPartial({
    accountNumber: Number(transactionData.accountNumber),
    bodyBytes: txBodyBytes,
    authInfoBytes,
    chainId,
  })

  // const signDocBytes = SignDoc.encode(signDocRaw).finish()

  const { signature, signed } = await signer.signDirect(
    senderAddress,
    signDocRaw
  )

  const txRaw = TxRaw.fromPartial({
    bodyBytes: signed.bodyBytes,
    authInfoBytes: signed.authInfoBytes,
    signatures: [fromBase64(signature.signature)],
  })

  console.log('txRaw', txRaw)

  console.log('body', TxBody.decode(txRaw.bodyBytes))
  console.log('authInfo', TxBody.decode(txRaw.authInfoBytes))
  // console.log('signatures', TxBody.decode(txRaw.signatures))

  const txBytes = Uint8Array.from(TxRaw.encode(txRaw).finish())
  console.log('txBytes', txBytes)

  const txResult = await client.broadcastTx(txBytes)
  console.log('txResult', txResult)

  /* const txResult = await client.signAndBroadcast(
    senderAddress,
    messages,
    stdFee,
    memo || ''
  ) */
  assertIsBroadcastTxSuccess(txResult)

  return {
    hash: txResult.transactionHash,
  }
}

export async function pollTxInclusion(txHash, iteration = 0) {
  const MAX_POLL_ITERATIONS = 30
  let txFound = false
  try {
    await fetch(`${network.apiURL}/txs/${txHash}`).then((res) => {
      if (res.status === 200) {
        txFound = true
      }
    })
  } catch (err) {
    // ignore error
  }
  if (txFound) {
    return true
  } else if (iteration < MAX_POLL_ITERATIONS) {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return pollTxInclusion(txHash, iteration + 1)
  } else {
    throw new Error(
      `The transaction wasn't included in time. Check explorers for the transaction hash ${txHash}.`
    )
  }
}
