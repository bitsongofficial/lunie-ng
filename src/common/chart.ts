import { compact } from 'lodash';
import { BigNumber } from 'bignumber.js';
import { ChartData, DetailedVote, TimelineData } from 'src/models';
import { compareNow, fromNow } from './date';

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

export const getMappedTimeline = (details: DetailedVote): TimelineData[] => {
  const timeline = details.timeline.map((el) => {
    if (el) {
      return ({
        label: el.title,
        active: el.time ? !compareNow(el.time) : false,
        subtitle: el.time ? `${fromNow(el.time)} ago` : '--'
      });
    }
  });

  return compact(timeline);
}
