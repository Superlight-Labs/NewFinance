import axios from 'axios';
import { Platform } from 'react-native';

export const backend = axios.create({
  baseURL: 'http://' + (Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1') + ':8080/',
});
