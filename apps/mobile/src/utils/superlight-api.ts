import { API_URL, HISTORY_API_URL } from '@env';
import axios from 'axios';

export const backend = axios.create({
  baseURL: API_URL,
});

export const historyApi = axios.create({
  baseURL: HISTORY_API_URL,
});
