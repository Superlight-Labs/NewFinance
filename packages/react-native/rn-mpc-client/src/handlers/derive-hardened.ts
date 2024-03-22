import {
  DeriveFrom,
  MPCWebsocketStarterWithSetup,
  OnSuccess,
  ShareResult,
  WebsocketError,
  buildPath,
  mpcInternalError,
  websocketError,
} from '@superlight-labs/mpc-common';
import { mpcApiError } from '@superlight-labs/mpc-common/src/error';
import { MPCStarterResult } from '@superlight-labs/mpc-common/src/websocket/handler';
import { reset } from '@superlight-labs/rn-crypto-mpc';
import { InProgressStep, StepResult } from '@superlight-labs/rn-crypto-mpc/src/types';
import { AxiosInstance } from 'axios';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { cleanInitParam } from '../lib/http-websocket/ws-client';
import { ApiStepResult } from '../lib/http-websocket/ws-common';
import {
  InitDeriveFrom,
  getResultDeriveBIP32,
  initDeriveBip32,
  step,
} from '../lib/mpc/mpc-neverthrow-wrapper';

// With Steps means that there are multiple steps necessary on client and server to create a keypair
// Usually used for hardened key derivation. One exception is the derivation of the master key from the seed shared,
// which is non-hardened, but via multiple steps
export const startDeriveWithSteps: MPCWebsocketStarterWithSetup<
  InitDeriveFrom,
  InProgressStep<DeriveFrom>
> = ({ axios, initParam }) => {
  return initDeriveBip32(initParam, initParam.hardened)
    .andThen(_ => step(null))
    .andThen((stepMsg: StepResult) => {
      if (stepMsg.type === 'error') {
        reset();
        return errAsync(mpcInternalError(stepMsg.error));
      }
      if (stepMsg.type === 'success') {
        reset();
        return errAsync(mpcInternalError('Unexpected success message received'));
      }

      return okAsync({ res: { ...stepMsg, initParam }, axios });
    })
    .andThen(res =>
      ResultAsync.fromPromise(
        axios.post('/mpc/ecdsa/derive/stepping', cleanInitParam(initParam)),
        err => mpcApiError(err, "Error while starting 'derive/stepping' in api")
      ).map(_ => res)
    );
};

export const deriveBip32WithSteps = ({
  res,
  axios,
}: MPCStarterResult<InProgressStep<DeriveFrom>>): ResultAsync<ShareResult, WebsocketError> => {
  return stepLoop(axios, res.message, res.initParam);
};

const stepLoop = (
  axios: AxiosInstance,
  lastClientMessage: number[],
  initParam: DeriveFrom,
  share?: string
): ResultAsync<ShareResult, WebsocketError> => {
  // Stepping with last message that was sent to client
  return ResultAsync.fromPromise(
    axios.post<ApiStepResult>('/mpc/ecdsa/step', {
      message: lastClientMessage,
      onSuccess: OnSuccess.ExtractAndSaveNewShare,
      path: buildPath(initParam),
    }),
    err => mpcApiError(err, 'Error while stepping in API')
    // Evaluate the result from api step
  ).andThen(response => {
    if (response.data.peerShareId) {
      if (!share) {
        return errAsync(mpcInternalError('No share received'));
      }

      return okAsync({ share, peerShareId: response.data.peerShareId });
    }

    if (response.data.message) {
      return step(response.data.message).andThen(result => {
        if (result.type === 'error') {
          return errAsync(websocketError(result.error));
        }

        if (result.type === 'success') {
          return getResultDeriveBIP32(result.context).andThen(deriveResult =>
            stepLoop(axios, result.message, initParam, deriveResult.keyShare)
          );
        }

        return stepLoop(axios, result.message, initParam);
      });
    }

    return errAsync(mpcInternalError('No peerShareId, or message received'));
  });
};
