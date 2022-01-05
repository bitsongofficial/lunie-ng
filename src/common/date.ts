import { formatDistanceToNowStrict, compareAsc } from 'date-fns';

export const fromNow = (time: string) => {
  const startDate = new Date(time);

  return formatDistanceToNowStrict(startDate);
}

// Return true if the first date is after the second one
export const compareNow = (time: string) => {
  return compareAsc(new Date(time), new Date()) === 1;
}
