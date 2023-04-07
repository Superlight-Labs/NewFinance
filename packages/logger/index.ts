import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'debug',
});

(logger as any).log = logger.info;

export default logger;
