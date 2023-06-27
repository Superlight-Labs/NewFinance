import { API_URL } from '@env';
import axios from 'axios';

export const backend = axios.create({
  baseURL: API_URL,
});
