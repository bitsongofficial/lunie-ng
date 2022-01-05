import { BigNumber } from 'bignumber.js';
import { ChartData, DetailedVote } from 'src/models';

export const getMappedVotes = (details: DetailedVote) => {
  const data: ChartData[] = [];

  data.push({
    label: 'Yes',
    color: 'white',
    value: new BigNumber(details.votingPercentageYes).multipliedBy(100).toNumber()
  });

  data.push({
    label: 'No',
    color: 'primary',
    value: new BigNumber(details.votingPercentageNo).multipliedBy(100).toNumber()
  });

  data.push({
    label: 'No with veto',
    color: 'accent-2',
    value: new BigNumber(details.votingPercentageNoWithVeto).multipliedBy(100).toNumber()
  });

  data.push({
    label: 'Abstain',
    color: 'secondary',
    value: new BigNumber(details.votingPercentageAbstain).multipliedBy(100).toNumber()
  });

  return data;
}
