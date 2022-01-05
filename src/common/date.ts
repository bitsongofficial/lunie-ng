import { formatDistanceToNowStrict } from 'date-fns';

export const fromNow = (time: string) => {
  const startDate = new Date(time);

  return formatDistanceToNowStrict(startDate);
}
