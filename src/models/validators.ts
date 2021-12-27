export interface Validator {
  id: number;
  name: string;
  picture: string;
  status: string;
  rewards: number;
  available: number;
  staked?: number;
  votingPower?: number;
  unstaked?: number;
  time?: number;
}
