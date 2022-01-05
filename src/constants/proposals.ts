import { Option } from 'src/models';

export const proposalsTypeOptions: Option[] = [
  {
    label: 'All',
    value: undefined,
  },
  {
    label: 'Deposit',
    value: 'DEPOSIT',
  },
  {
    label: 'Voting',
    value: 'VOTING',
  },
  {
    label: 'Passed',
    value: 'PASSED',
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
  },
];
