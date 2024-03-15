import {
  MPCWebsocketMessage,
  MPCWebsocketResult,
  WebsocketError,
} from '@superlight-labs/mpc-common';
import { FastifyRequest } from 'fastify';
import { ResultAsync } from 'neverthrow';
import { Subject } from 'rxjs';
import { User } from 'src/repository/user';
import { createGenerateEcdsaKey } from '../mpc-context.service';

export const generateEcdsaKey = (req: FastifyRequest, user: User): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  createGenerateEcdsaKey();

  return output;
};
