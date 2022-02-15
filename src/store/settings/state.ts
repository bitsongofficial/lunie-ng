export interface SettingsStateInterface {
  language: string;
  currency: string;
  disclaimer: boolean;
}

function state (): SettingsStateInterface {
  return {
    language: 'en-US',
    currency: 'usd',
    disclaimer: false
  };
}

export default state;
