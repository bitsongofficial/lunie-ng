declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    VUE_APP_COINGECKO_URL: string;
    VUE_APP_COINGECKO_WEBSITE: string;
    VUE_APP_IMPERATOR_URL: string;
    VUE_APP_BTSG_CONTRACT: string;
    VUE_APP_BRIDGE_CONTRACT: string;
    VUE_APP_BRIDGE_FEE: number;
    VUE_APP_NETWORK: number;
    VUE_APP_NETWORK_NAME: string;
    VUE_APP_INFURA: string;
    VUE_APP_ETHERSCAN: string;
  }
}
