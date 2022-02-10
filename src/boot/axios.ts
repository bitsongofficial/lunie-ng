import { boot } from 'quasar/wrappers';
import axios from 'axios';
import Store from 'src/store';

const api = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

const coinGeckoApi = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  baseURL: process.env.VUE_APP_COINGECKO_URL
});

const imperatorApi = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  baseURL: process.env.VUE_APP_IMPERATOR_URL
});

const cassiniApi = axios.create({
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
  baseURL: process.env.VUE_APP_CASSINI_URL
});

const external = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

export default boot(() => {
  api.defaults.baseURL = Store.state.authentication.network.apiURL;
});

export { api, external, coinGeckoApi, imperatorApi, cassiniApi };
