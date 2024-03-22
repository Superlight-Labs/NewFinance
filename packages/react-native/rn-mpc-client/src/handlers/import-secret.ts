import {
  MPCWebsocketHandlerWithSetup,
  MPCWebsocketStarterWithSetup,
  OnSuccess,
  ShareResult,
  mpcInternalError,
} from '@superlight-labs/mpc-common';
import { mpcApiError } from '@superlight-labs/mpc-common/src/error';
import { reset } from '@superlight-labs/rn-crypto-mpc';
import { StepResult, SuccessfulStep } from '@superlight-labs/rn-crypto-mpc/src/types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { ApiStepResult } from '../lib/http-websocket/ws-common';
import { initImportGenericSecret, step } from '../lib/mpc/mpc-neverthrow-wrapper';

export const startImportGenericSecret: MPCWebsocketStarterWithSetup<string, SuccessfulStep> = ({
  axios,
  initParam,
}) => {
  return initImportGenericSecret(initParam)
    .andThen(_ => step(null))
    .andThen((stepMsg: StepResult) => {
      if (stepMsg.type === 'error') {
        reset();
        return errAsync(mpcInternalError(stepMsg.error));
      }
      if (stepMsg.type !== 'success' || !stepMsg.keyShare) {
        reset();
        return errAsync(mpcInternalError('No share received'));
      }

      return okAsync({ res: stepMsg, axios });
    })
    .andThen(res =>
      ResultAsync.fromPromise(
        axios.post('/mpc/ecdsa/import-generic-secret', { hexSeed: initParam }),
        err => mpcApiError(err, "Error while starting 'generate-generic' in api")
      ).map(_ => res)
    );
};

export const importGenericSecret: MPCWebsocketHandlerWithSetup<ShareResult, SuccessfulStep> = ({
  res,
  axios,
}) =>
  ResultAsync.fromPromise(
    axios.post<ApiStepResult>('/mpc/ecdsa/step', {
      message: res.message,
      onSuccess: OnSuccess.SaveKeyShare,
    }),
    err => mpcApiError(err, 'Error while stepping in API')
  ).andThen(stepRes => {
    if (stepRes.data.peerShareId) {
      return okAsync({ share: res.keyShare, peerShareId: stepRes.data.peerShareId });
    }
    return errAsync(mpcInternalError('No peerShareId received after generate-generic-secret'));
  });
