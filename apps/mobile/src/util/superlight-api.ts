import axios from 'axios';
import { Platform } from 'react-native';

export const apiUrl = (Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1') + ':8080';

export const backend = axios.create({
  baseURL: `http://${apiUrl}/`,
});
