import { API_URL } from '@env';
import axios from 'axios';

export const backend = axios.create({
  baseURL: API_URL,
});

export const historyApi = axios.create({
  baseURL: 'https://orca-app-an4qn.ondigitalocean.app/',
});
