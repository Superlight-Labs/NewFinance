import { config as loadConfig } from 'dotenv';

interface Config {
  cookieSecret: string;
  ethereumAddressPath: string;
  logLevel: string;
}

const initConfig = (): Config => {
  loadConfig();

  return {
    cookieSecret: process.env.COOKIE_SECRET || '',
    ethereumAddressPath: process.env.ETHEREUM_ADDRESS_PATH || '',
    logLevel: process.env.LOG_LEVEL || 'debug',
  };
};

const config = initConfig();

export default config;
