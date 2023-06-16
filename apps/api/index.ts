import config from '@lib/config';
import { client } from '@superlight-labs/database';
import logger from '@superlight-labs/logger';
import { createServer } from 'src/server';

createServer(client)
  .then(server => {
    server.listen({ host: config.host, port: config.port }, (err, address) => {
      if (err) {
        logger.error({ err, address }, 'Error while trying to listen on port 8080');
        process.exit(1);
      }
    });
  })
  .catch(err => logger.fatal({ err }, 'Unexpected Error from Server caught on top level'));

process.on('uncaughtException', err => {
  logger.error({ err }, 'Uncaugh Exception');
  logger.warn('Shutting down server because of uncaught exception');

  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(
    {
      error: reason,
    },
    'Unhandled Promise Rejection'
  );

  // need to log the promise without stringifying it to properly
  // display all rejection info
  logger.warn({ promise });

  // TODO: stream errors to sentry

  process.exit(1);
});
