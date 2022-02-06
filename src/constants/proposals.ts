import { Option } from 'src/models';

export const proposalsTypeOptions: Option[] = [
  {
    label: 'general.all',
    value: undefined,
  },
  {
    label: 'general.deposit',
    value: 'DEPOSIT',
  },
  {
    label: 'general.voting',
    value: 'VOTING',
  },
  {
    label: 'general.passed',
    value: 'PASSED',
  },
  {
    label: 'general.rejected',
    value: 'REJECTED',
  },
];
