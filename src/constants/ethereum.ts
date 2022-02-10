import { NetworkConfig } from 'src/models';

// Default ethereum
export const ethereum: Partial<NetworkConfig> = {
  id: 'ethereum',
  name: 'Ethereum',
  stakingDenom: 'ETH',
  description: 'Ethereum',
  icon: 'coins/eth.svg'
};
