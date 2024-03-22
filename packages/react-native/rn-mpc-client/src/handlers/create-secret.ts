import logger from '@superlight-labs/logger';
import {
  OnSuccess,
  ShareResult,
  WebsocketError,
  mpcInternalError,
} from '@superlight-labs/mpc-common';
import { mpcApiError } from '@superlight-labs/mpc-common/src/error';
import { MPCStarterResult } from '@superlight-labs/mpc-common/src/websocket/handler';
import { reset } from '@superlight-labs/rn-crypto-mpc';
import { StepResult, SuccessfulStep } from '@superlight-labs/rn-crypto-mpc/src/types';
import { AxiosInstance } from 'axios';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { ApiStepResult } from '../lib/http-websocket/ws-common';
import { initGenerateGenericSecret, step } from '../lib/mpc/mpc-neverthrow-wrapper';

export const startGenerateGenericSecret = (
  axios: AxiosInstance
): ResultAsync<{ res: SuccessfulStep; axios: AxiosInstance }, WebsocketError> => {
  return initGenerateGenericSecret()
    .andThen(_ => step(null))
    .andThen((stepMsg: StepResult) => {
      logger.info({ stepMsg }, 'Step result received');
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
      ResultAsync.fromPromise(axios.post('/mpc/ecdsa/generate-generic-secret', undefined), err =>
        mpcApiError(err, "Error while starting 'generate-generic' in api")
      ).map(_ => res)
    );
};

export const generateGenericSecret = ({
  res,
  axios,
}: MPCStarterResult<SuccessfulStep>): ResultAsync<ShareResult, WebsocketError> =>
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
