import { ProposalStatus, ValidatorStatus } from 'src/models';

export const getValidatorStatusColor = (status: ValidatorStatus) => {
  switch (status) {
    case ValidatorStatus.ACTIVE:
      return 'info';
    case ValidatorStatus.INACTIVE:
      return 'accent-6';
    default:
      return 'gray2';
  }
}

export const getProposalStatusColor = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.DEPOSIT:
    case ProposalStatus.VOTING:
      return 'warning';
    case ProposalStatus.PASSED:
      return 'info';
    case ProposalStatus.REJECTED:
    case ProposalStatus.FAILED:
      return 'negative';
    case ProposalStatus.UNSPECIFIED:
    default:
      return 'gray2';
  }
}
