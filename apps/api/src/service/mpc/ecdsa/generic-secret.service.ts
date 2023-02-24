import { Context } from '@crypto-mpc';
import {
  databaseError,
  mpcInternalError,
  WebsocketError,
} from '@lib/routes/websocket/websocket-error';
import { MPCWebsocketMessage, MPCWebsocketResult } from '@lib/routes/websocket/websocket-handlers';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { RawData } from 'ws';
import { step } from '../step/step';

export const generateGenericSecret = (
  user: User,
  messages: Observable<RawData>
): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();
  const context = Context.createGenerateGenericSecretContext(2, 256);

  messages.subscribe(message => {
    const stepOutput = step(message.toString(), context);

    switch (stepOutput.type) {
      case 'inProgress':
        output.next(okAsync({ type: 'inProgress', message: stepOutput.message }));
        return;
      case 'success':
        const keyShare = context.getNewShare().toString('base64');
        output.next(processGenericSecret(user, keyShare));
        context.free();
        return;
      case 'error':
        output.next(errAsync(mpcInternalError()));
        context.free();
        return;
      default:
        throw new Error('Unexpected step output');
    }
  });

  return output;
};

const processGenericSecret = (
  user: User,
  keyShare: string
): ResultAsync<MPCWebsocketMessage, WebsocketError> => {
  return ResultAsync.fromPromise(saveKeyShare(user, keyShare, 'secret'), err =>
    databaseError(err, 'Error while saving generic secret key share')
  ).map(keyShare => ({ type: 'success', result: keyShare.id }));
};
