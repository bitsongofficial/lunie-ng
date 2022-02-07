import { toUbtsg } from 'src/util';
import { SigningStargateClient } from '@cosmjs/stargate';
import { coin } from '@cosmjs/proto-signing';
import Long from 'long';
import { IBCTransferRequest } from 'src/models';
import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { TransferStateInterface } from './state';

const actions: ActionTree<TransferStateInterface, StateInterface> = {
  async transferIBC({ commit }, payload: IBCTransferRequest) {
    try {
      commit('setSending', true);

      if (window.keplr) {
        await window.keplr.enable(payload.from.chainId);

        const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(payload.from.chainId);
        const [account] = await offlineSigner.getAccounts();
        const fromAddress = account.address;

        const client = await SigningStargateClient.connectWithSigner(
          payload.from.rpc,
          offlineSigner
        );

        const height = await client.getHeight();
        const amount = toUbtsg(payload.amount);

        const result = await client.sendIbcTokens(
          fromAddress,
          payload.toAddress,
          coin(amount, payload.from.ibc[payload.to.prefix].ibcDenom),
          'transfer',
          payload.from.ibc[payload.to.prefix].channel,
          {
            revisionHeight: Long.fromNumber(1),
            revisionNumber: Long.fromNumber(height + 100),
          },
          Math.floor(Date.now() / 1000) + 600,
          {
            amount: payload.from.fee.coins.map(
              (feeCoin) => coin(feeCoin.amount.toString(), feeCoin.denom),
            ),
            gas: payload.from.fee.gas,
          }
        );

        return result;
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
