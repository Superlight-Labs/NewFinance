import { config as loadConfig } from 'dotenv';

interface Config {
  cookieSecret: string;
  logLevel: string;
}

const initConfig = (): Config => {
  loadConfig();

  return {
    cookieSecret: process.env.COOKIE_SECRET || '',
    logLevel: process.env.LOG_LEVEL || 'debug',
  };
};

const config = initConfig();

export default config;
