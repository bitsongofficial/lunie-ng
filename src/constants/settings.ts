import { Option } from 'src/models';

export const settingsType: Option[] = [
  {
    label: 'Language',
    value: 'language',
  },
  {
    label: 'Currency',
    value: 'currency',
  },
];

export const languages: Option[] = [
  /* {
    label: 'Italian',
    value: 'it-IT',
  }, */
  {
    label: 'English',
    value: 'en-US',
  },
];

export const currencies: Option[] = [
  {
    label: 'EUR',
    value: 'eur',
  },
  {
    label: 'USD',
    value: 'usd',
  },
  {
    label: 'GBP',
    value: 'gbp',
  },
  {
    label: 'AUD',
    value: 'aud',
  },
  {
    label: 'IDR',
    value: 'idr',
  },
  {
    label: 'AED',
    value: 'aed',
  }
];
