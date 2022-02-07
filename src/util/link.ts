export const mintScanLink = (hash: string, chain: string) : string => {
  return `https://www.mintscan.io/${chain}/txs/${hash}`;
}
