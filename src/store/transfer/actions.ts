import { toUbtsg } from 'src/common/numbers';
import { SigningStargateClient } from '@cosmjs/stargate';
import { coin } from '@cosmjs/proto-signing';
import Long from 'long';
import { IBCTransferRequest } from 'src/models';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { TransferStateInterface } from './state';
import { ibcChains } from 'src/constants';

const actions: ActionTree<TransferStateInterface, StateInterface> = {
  async transferIBC({ commit }, payload: IBCTransferRequest) {
    try {
      commit('setSending', true);

      if (window.keplr && payload.from && payload.to && payload.from.id && payload.from.rpcURL && payload.to.id && payload.from.fees) {
        await window.keplr.enable(payload.from.id);

        const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(payload.from.id);
        const [account] = await offlineSigner.getAccounts();
        const fromAddress = account.address;

        const client = await SigningStargateClient.connectWithSigner(
          payload.from.rpcURL,
          offlineSigner
        );

        const height = await client.getHeight();
        const amount = toUbtsg(payload.amount);

        const ibc = ibcChains.find(el => payload.from && el.id === payload.from.id);

        if (ibc) {
          const result = await client.sendIbcTokens(
            fromAddress,
            payload.toAddress,
            coin(amount, ibc.ibc[payload.to.id].ibcDenom),
            'transfer',
            ibc.ibc[payload.to.id].channel,
            {
              revisionHeight: Long.fromNumber(1),
              revisionNumber: Long.fromNumber(height + 100),
            },
            Math.floor(Date.now() / 1000) + 600,
            {
              amount: payload.from.fees.ibcTransfer.feeOptions.map(
                (feeCoin) => coin(feeCoin.amount, feeCoin.denom),
              ),
              gas: payload.from.fees.ibcTransfer.gasEstimate.toString(),
            }
          );

          return result;
        }
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      commit('setSending', false);
    }
  }
};

export default actions;
