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

export default boot(() => {
  api.defaults.baseURL = Store.state.authentication.network.apiURL;
});

export { api };
