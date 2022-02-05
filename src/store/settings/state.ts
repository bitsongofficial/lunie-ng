export interface SettingsStateInterface {
  language: string;
  currency: string;
}

function state (): SettingsStateInterface {
  return {
    language: 'en-US',
    currency: 'usd'
  };
}

export default state;
