import axios from 'axios';
import { network } from 'src/constants';

const api = axios.create({
  baseURL: network.apiURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
  responseType: 'json',
});

export { api };
