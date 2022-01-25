import { ProposalStatus, ValidatorStatus } from 'src/models';

export const getValidatorStatusColor = (status: ValidatorStatus) => {
  switch (status) {
    case ValidatorStatus.ACTIVE:
      return 'info';
    case ValidatorStatus.INACTIVE:
      return 'negative';
    default:
      return 'gray2';
  }
}

export const getProposalStatusColor = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.DEPOSIT:
    case ProposalStatus.VOTING:
      return 'primary';
    case ProposalStatus.PASSED:
      return 'primary';
    case ProposalStatus.REJECTED:
    case ProposalStatus.FAILED:
      return 'dark';
    case ProposalStatus.UNSPECIFIED:
    default:
      return 'dark';
  }
}

export const getProposalTextStatusColor = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.DEPOSIT:
    case ProposalStatus.VOTING:
      return 'dark';
    case ProposalStatus.PASSED:
      return 'primary';
    case ProposalStatus.REJECTED:
    case ProposalStatus.FAILED:
      return 'white';
    case ProposalStatus.UNSPECIFIED:
    default:
      return 'white';
  }
}

export const getProposalStatusOutline = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.PASSED:
      return true;
    default:
      return false;
  }
}
