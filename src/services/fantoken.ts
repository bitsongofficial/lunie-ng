import { queryAutoPaginate } from './cosmos';
import { BitsongClient } from '@bitsongjs/sdk';
import { Coin } from '@cosmjs/stargate';
import { api } from 'src/boot/axios';
import { FantokenParamsResponse } from 'src/models';
import Store from 'src/store';

export let bitsong: BitsongClient;

export const initBitsong = async () => {
  try {
    const { rpcURL } = Store.state.authentication.network;

    bitsong = await BitsongClient.connect(rpcURL);
  } catch (error){
    console.error(error);
    throw error;
  }
}

export const getBurnedTokens = async () => {
  try {
    const response = await queryAutoPaginate<Coin>('bitsong/fantoken/v1beta1/total_burn');

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const getFantokensParams = async () => {
  try {
    const response = await api.get<FantokenParamsResponse>('bitsong/fantoken/v1beta1/params');

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
