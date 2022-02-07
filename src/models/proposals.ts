import { Tally } from '@cosmjs/launchpad/build/lcdapi/gov';
import { Coin } from '@cosmjs/stargate';
import { BalanceCoin } from './rewards';
import { PaginationResponse } from './balances';
import { Validator, TopVoterValidator } from './validators';
import { BigNumber } from 'bignumber.js';

export enum ProposalStatus {
  DEPOSIT = 'DEPOSIT',
  VOTING = 'VOTING',
  PASSED = 'PASSED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED',
  UNSPECIFIED = 'UNSPECIFIED'
}

export enum VoteOption {
  VOTE_OPTION_UNSPECIFIED = 'VOTE_OPTION_UNSPECIFIED', // defines a no-op vote option.
  VOTE_OPTION_YES = 'VOTE_OPTION_YES', // defines a yes vote option.
  VOTE_OPTION_ABSTAIN = 'VOTE_OPTION_ABSTAIN', // defines an abstain vote option.
  VOTE_OPTION_NO = 'VOTE_OPTION_NO', // defines a no vote option.
  VOTE_OPTION_NO_WITH_VETO = 'VOTE_OPTION_NO_WITH_VETO' // defines a no with veto vote option.
}

export enum ProposalRawStatus {
  PROPOSAL_STATUS_UNSPECIFIED = 'PROPOSAL_STATUS_UNSPECIFIED', // defines the default propopsal status.
  PROPOSAL_STATUS_DEPOSIT_PERIOD = 'PROPOSAL_STATUS_DEPOSIT_PERIOD', // defines a proposal status during the deposit period.
  PROPOSAL_STATUS_VOTING_PERIOD = 'PROPOSAL_STATUS_VOTING_PERIOD', // defines a proposal status during the voting period.
  PROPOSAL_STATUS_PASSED = 'PROPOSAL_STATUS_PASSED', // defines a proposal status of a proposal that has passed.
  PROPOSAL_STATUS_REJECTED = 'PROPOSAL_STATUS_REJECTED', // PROPOSAL_STATUS_REJECTED defines a proposal status of a proposal that has been rejected.
  PROPOSAL_STATUS_FAILED = 'PROPOSAL_STATUS_FAILED', // PROPOSAL_STATUS_FAILED defines a proposal status of a proposal that has failed.
}

export enum ProposalType {
  SOFTWARE_UPGRADE = 'SOFTWARE_UPGRADE',
  TEXT = 'TEXT',
  PARAMETER_CHANGE = 'PARAMETER_CHANGE',
  TREASURY = 'TREASURY',
}

export enum ProposalSubmitType {
  TEXT = 'ProposalTypeText',
}

export interface ProposalSubmitRequest {
  id?: number;
  title: string;
  typology: ProposalSubmitType;
  initialDeposit: string;
  description: string;
}

export interface DepositParams {
  max_deposit_period: string;
  min_deposit: Coin[];
}

export interface TallyParams {
  quorum: string;
  threshold: string;
  veto_threshold: string;
}

export interface VotingParams {
  voting_period: string;
}

export interface GovParamsResponse {
  deposit_params: DepositParams;
  tally_params: TallyParams;
  voting_params: VotingParams;
}

export interface ProposalRaw {
  readonly id: string;
  readonly proposal_status: string;
  readonly final_tally_result: Tally | {
    readonly tally: Tally;
  };
  readonly tally: Tally;
  readonly submit_time: string;
  readonly total_deposit: readonly Coin[];
  readonly deposit_end_time: string;
  readonly voting_start_time: string;
  readonly voting_end_time: string;
  readonly content: {
    readonly '@type': string;
    readonly title: string;
    readonly description: string;
  };
  readonly status: ProposalRawStatus;
  readonly proposal_id: string;
}

export interface ProposalResponse extends PaginationResponse {
  proposals: ProposalRaw[];
}

export interface Vote {
  proposal_id: string;
  voter: string;
  option: VoteOption;
}

export interface VoteResponse extends PaginationResponse {
  votes: Vote[];
}

export interface Deposit {
  proposal_id: string;
  depositor: string;
  amount: Coin[];
}

export interface DepositResponse extends PaginationResponse {
  deposits: Deposit[];
}

export interface DetailedVote {
  deposits: {
    id: string;
    amount: BalanceCoin[];
    depositer: {
      name: string | undefined;
      address: string;
      picture: string | undefined;
      validator: Validator | undefined;
    };
  }[];
  depositsSum: string | never[];
  percentageDepositsNeeded: string | number | never[];
  votes: {
    id: string;
    voter: {
      name: string | undefined;
      address: string;
      picture: string | undefined;
      validator: Validator | undefined;
    };
    option: VoteOption;
  }[];
  votingQuorum: string;
  votesSum: number | never[];
  votingThresholdYes: string;
  votingThresholdNo: string;
  votingPercentageYes: string | number;
  votingPercentageNo: string | number;
  votingPercentageNoWithVeto: string | number;
  votingPercentageAbstain: string | number;
  tally: Tally;
  timeline: (TimelineEntry | undefined)[];
}

export interface TimelineEntry {
  title: string;
  time: string | undefined;
}

export interface TallyWithExtra {
  yes: string | number | BigNumber;
  abstain: string | number | BigNumber;
  veto: string | number | BigNumber;
  no: string | number | BigNumber;
  total: string | number | BigNumber;
  totalVotedPercentage?: string | number;
}

export interface Proposal {
  id: number;
  proposalId: string;
  type: ProposalType;
  title: string;
  description: string;
  creationTime: string;
  status: ProposalStatus;
  statusBeginTime: string | undefined;
  statusEndTime: string | undefined;
  tally: TallyWithExtra | null;
  deposit: string | number | BigNumber;
  summary: string;
  detailedVotes: DetailedVote | null;
}

export interface GovernanceOverview {
  totalStakedAssets: string | null;
  totalVoters: undefined;
  treasurySize: string | null;
  topVoters: TopVoterValidator[];
}
