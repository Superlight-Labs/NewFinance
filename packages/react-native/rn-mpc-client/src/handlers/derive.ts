import {
  MPCWebsocketHandlerWithSetup,
  MPCWebsocketStarterWithSetup,
  ShareResult,
  mpcInternalError,
} from '@superlight-labs/mpc-common';
import { apiError, mpcApiError } from '@superlight-labs/mpc-common/src/error';
import { getResultDeriveBIP32, reset } from '@superlight-labs/rn-crypto-mpc';
import { NoStepDeriveResult, StepResult } from '@superlight-labs/rn-crypto-mpc/src/types';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { cleanInitParam } from '../lib/http-websocket/ws-client';
import { ApiStepResult } from '../lib/http-websocket/ws-common';
import { InitDeriveFrom, initDeriveBip32, step } from '../lib/mpc/mpc-neverthrow-wrapper';

// Without steps -> means, that the key can be fetched from the mpc context immediately on the server.
// Client side it is necessary to step once with `step(null)`

export const startDerive: MPCWebsocketStarterWithSetup<InitDeriveFrom, NoStepDeriveResult> = ({
  axios,
  initParam,
}) => {
  return initDeriveBip32(initParam, false)
    .andThen(_ => step(null))
    .andThen((stepMsg: StepResult) => {
      if (stepMsg.type === 'error') {
        reset();
        return errAsync(mpcInternalError(stepMsg.error));
      }

      if (stepMsg.type !== 'success' || !stepMsg.context) {
        reset();
        return errAsync(mpcInternalError('No context received'));
      }

      return okAsync({ context: stepMsg.context });
    })
    .andThen(({ context }) =>
      ResultAsync.fromPromise(
        axios.post<ApiStepResult>('/mpc/ecdsa/derive/no-steps', cleanInitParam(initParam)),
        err => mpcApiError(err, "Error while starting 'derive/no-steps' in api")
      ).andThen(res => {
        if (res.data.peerShareId) {
          return okAsync({ res: { peerShareId: res.data.peerShareId, context }, axios });
        }

        return errAsync(apiError('No peerShareId received after derive/no-steps'));
      })
    );
};

export const deriveBip32: MPCWebsocketHandlerWithSetup<ShareResult, NoStepDeriveResult> = ({
  res,
}) => {
  const share = ResultAsync.fromPromise(getResultDeriveBIP32(res.context), err =>
    mpcInternalError(err, "Couldn't get share from context")
  );

  return share.map(({ keyShare }) => ({ share: keyShare, peerShareId: res.peerShareId }));
};
