import { Context } from '@crypto-mpc';
import { step } from '@lib/utils/crypto';
import logger from '@superlight-labs/logger';
import {
    buildPath,
    databaseError,
    DeriveConfig,
    mpcInternalError,
    MPCWebscocketInit,
    MPCWebsocketMessage,
    MPCWebsocketResult,
    stepMessageError,
    WebsocketError,
    WebSocketOutput,
} from '@superlight-labs/mpc-common';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { MpcKeyShare } from 'src/repository/key-share';
import { readKeyShareByPath, saveShareBasedOnPath } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import {
    createDeriveBIP32Context,
    getNewShare,
    getResultDeriveBIP32,
} from 'src/service/mpc/mpc-context.service';
import { deleteKeyShare, getKeyShare } from 'src/service/persistance/key-share.service';

type OnDeriveStep = (
  deriveContext: DeriveContext,
  message: MPCWebsocketMessage | undefined,
  user: User,
  output: WebSocketOutput
) => void;

const deriveBIP32 =
  (stepFn: OnDeriveStep) =>
  (
    user: User,
    messages: Observable<MPCWebsocketMessage>,
    initParameter: MPCWebscocketInit<DeriveConfig>
  ): MPCWebsocketResult => {
    const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

    initDeriveProcess(initParameter.parameter, user.id).match(
      deriveContext => {
        const { context } = deriveContext;

        messages.subscribe({
          next: message => stepFn(deriveContext, message, user, output),
          error: err => {
            logger.error({ err, user: user.id }, 'Error received from client on websocket');
            context.free();
          },
          complete: () => {
            logger.info({ user: user.id }, 'Connection on Websocket closed');
            context.free();
          },
        });
      },
      err => output.next(errAsync(err))
    );

    return output;
  };

const initDeriveProcess = (
  deriveConfig: DeriveConfig,
  userId: string
): ResultAsync<DeriveContext, WebsocketError> => {
  const path = buildPath(deriveConfig);

  return deleteExistingShareByPath(path, userId).andThen(_ => setupContext(deriveConfig, userId));
};

const deleteExistingShareByPath = (
  path: string,
  userId: string
): ResultAsync<MpcKeyShare | null, WebsocketError> => {
  return ResultAsync.fromPromise(readKeyShareByPath(path, userId), err =>
    databaseError({ err, path }, 'Error while checking if keyshare with path exists')
  ).andThen(deleteKeyShare);
};

const setupContext = (
  deriveConfig: DeriveConfig,
  userId: string
): ResultAsync<DeriveContext, WebsocketError> => {
  return getKeyShare(deriveConfig.peerShareId, userId).andThen(parentKeyShare =>
    createDeriveBIP32Context(parentKeyShare.value, deriveConfig.hardened, deriveConfig.index).map(
      context => ({ deriveConfig, parent: parentKeyShare, context })
    )
  );
};

const deriveWithoutStepping = (
  deriveContext: DeriveContext,
  message: MPCWebsocketMessage | undefined,
  user: User,
  output: WebSocketOutput
) => {
  getResultDeriveBIP32(deriveContext.context)
    .map(share => {
      output.next(saveDerivedShare(user, share, deriveContext));
      deriveContext.context.free();
    })
    .mapErr(err => {
      output.next(errAsync(err));
      deriveContext.context.free();
    });
};

const deriveWithSteps = async (
  deriveContext: DeriveContext,
  wsMsg: MPCWebsocketMessage | undefined,
  user: User,
  output: WebSocketOutput
) => {
  const { context } = deriveContext;

  if (!wsMsg || wsMsg.type !== 'inProgress') {
    output.next(errAsync(stepMessageError('Invalid Step Message, closing connection')));
    return;
  }

  const stepOutput = step(wsMsg.message, context);

  if (stepOutput.type === 'inProgress') {
    output.next(okAsync({ type: 'inProgress', message: stepOutput.message }));
    return;
  }

  if (stepOutput.type === 'success') {
    getNewShare(context)
      .map(share => {
        output.next(saveDerivedShare(user, share, deriveContext));
        context.free();
      })
      .mapErr(err => {
        output.next(errAsync(err));
        context.free();
      });

    return;
  }

  if (stepOutput.type === 'error') {
    output.next(errAsync(mpcInternalError(stepOutput.error)));
    context.free();
    return;
  }

  throw new Error('Unexpected step output');
};

const saveDerivedShare = (
  user: User,
  share: string,
  deriveContext: DeriveContext
): ResultAsync<MPCWebsocketMessage, WebsocketError> => {
  const { parent, deriveConfig } = deriveContext;

  return ResultAsync.fromPromise(saveShareBasedOnPath(user, share, parent, deriveConfig), err =>
    databaseError(err, 'Error while saving derived Keyshare to DB')
  ).map(keyShare => ({ type: 'success', result: keyShare.id }));
};

type DeriveContext = {
  deriveConfig: DeriveConfig;
  parent: MpcKeyShare;
  context: Context;
};

export const deriveBip32WithSteps = deriveBIP32(deriveWithSteps);
export const deriveBip32WithoutStepping = deriveBIP32(deriveWithoutStepping);
