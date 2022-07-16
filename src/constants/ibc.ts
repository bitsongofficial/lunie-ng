import { IBCChain } from 'src/models';

export const ibcChains: IBCChain[] = [
  {
    id: 'bitsong-2b',
    btsgDenom: 'ubtsg',
    ibc: {
      'osmosis-1': {
        channel: 'channel-0',
        ibcDenom: 'ubtsg'
      },
      'cosmoshub-4': {
        channel: 'channel-1',
        ibcDenom: 'ubtsg'
      },
      'juno-1': {
        channel: 'channel-5',
        ibcDenom: 'ubtsg'
      },
    }
  },
  {
    id: 'osmosis-1',
    btsgDenom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452',
    ibc: {
      'bitsong-2b': {
        channel: 'channel-73',
        ibcDenom: 'ibc/4E5444C35610CC76FC94E7F7886B93121175C28262DDFDDE6F84E82BF2425452'
      },
    }
  },
  {
    id: 'cosmoshub-4',
    btsgDenom: 'ibc/E7D5E9D0E9BF8B7354929A817DD28D4D017E745F638954764AA88522A7A409EC',
    ibc: {
      'bitsong-2b': {
        channel: 'channel-229',
        ibcDenom: 'ibc/E7D5E9D0E9BF8B7354929A817DD28D4D017E745F638954764AA88522A7A409EC'
      },
    }
  },
  {
    id: 'juno-1',
    btsgDenom: 'ibc/008BFD000A10BCE5F0D4DD819AE1C1EC2942396062DABDD6AE64A655ABC7085B',
    ibc: {
      'bitsong-2b': {
        channel: 'channel-17',
        ibcDenom: 'ibc/008BFD000A10BCE5F0D4DD819AE1C1EC2942396062DABDD6AE64A655ABC7085B'
      },
    }
  },
  /* {
    id: 'ethereum',
    btsgDenom: '',
    ibc: {
      'bitsong-2b': {
        channel: '',
        ibcDenom: ''
      },
    }
  }, */
];
