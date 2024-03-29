import {
  MPCWebsocketHandlerWithSetup,
  MPCWebsocketStarterWithSetup,
  OnSuccess,
  WebsocketError,
  mpcInternalError,
  websocketError,
} from '@superlight-labs/mpc-common';
import { mpcApiError } from '@superlight-labs/mpc-common/src/error';
import { reset } from '@superlight-labs/rn-crypto-mpc';
import {
  InProgressStep,
  SignatureResult,
  StepResult,
} from '@superlight-labs/rn-crypto-mpc/src/types';
import { AxiosInstance } from 'axios';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { cleanInitParam } from '../lib/http-websocket/ws-client';
import { ApiStepResult } from '../lib/http-websocket/ws-common';
import {
  InitSign,
  getResultSignEcdsa,
  initSignEcdsa,
  step,
} from '../lib/mpc/mpc-neverthrow-wrapper';

export const startSign: MPCWebsocketStarterWithSetup<InitSign, InProgressStep<undefined>> = ({
  axios,
  initParam,
}) => {
  return initSignEcdsa(initParam)
    .andThen(_ => step(null))
    .andThen((stepMsg: StepResult) => {
      if (stepMsg.type === 'error') {
        reset();
        return errAsync(mpcInternalError(stepMsg.error));
      }

      return okAsync({ res: stepMsg, axios });
    })
    .andThen(res =>
      ResultAsync.fromPromise(axios.post('/mpc/ecdsa/sign', cleanInitParam(initParam)), err =>
        mpcApiError(err, "Error while starting 'derive/stepping' in api")
      ).map(_ => res)
    );
};

export const signEcdsa: MPCWebsocketHandlerWithSetup<string, InProgressStep<undefined>> = ({
  res,
  axios,
}) => {
  return stepLoop(axios, res.message);
};

const stepLoop = (
  axios: AxiosInstance,
  lastClientMessage: number[],
  signResult?: SignatureResult
): ResultAsync<string, WebsocketError> => {
  // Stepping with last message that was sent to client
  return ResultAsync.fromPromise(
    axios.post<ApiStepResult>('/mpc/ecdsa/step', {
      message: lastClientMessage,
      onSuccess: OnSuccess.Sign,
    }),
    err => mpcApiError(err, 'Error while stepping in API')
    // Evaluate the result from api step
  ).andThen(response => {
    if (response.data.signDone) {
      if (!signResult) {
        return errAsync(mpcInternalError('No signature received'));
      }
      return okAsync(signResult.signature);
    }

    if (response.data.message) {
      return step(response.data.message).andThen(result => {
        if (result.type === 'error') {
          return errAsync(websocketError(result.error));
        }

        if (result.type === 'success') {
          return getResultSignEcdsa(result.context).andThen(signResult =>
            stepLoop(axios, result.message, signResult)
          );
        }

        return stepLoop(axios, result.message);
      });
    }

    return errAsync(mpcInternalError('No peerShareId, or message received'));
  });
};
