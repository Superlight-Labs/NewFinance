import { config as loadConfig } from 'dotenv';

interface Config {
  cookieSecret: string;
  logLevel: string;
  host: string;
  port: number;
}

const initConfig = (): Config => {
  loadConfig();

  return {
    cookieSecret: process.env.COOKIE_SECRET || '',
    logLevel: process.env.LOG_LEVEL || 'debug',
    host: process.env.API_HOST || '0.0.0.0',
    port: parseInt(process.env.API_PORT || '3000', 10),
  };
};

const config = initConfig();

export default config;
