import { AppError, MPCWebsocketStarter, mapWebsocketToAppError } from '@superlight-labs/mpc-common';
import {
  MPCWebsocketHandler,
  MPCWebsocketStarterWithSetup,
} from '@superlight-labs/mpc-common/src/websocket/handler';
import { ResultAsync } from 'neverthrow';
import { Signer, createNonce, createRequestor } from './ws-common';

export const authWebsocket =
  (baseUrl: string, sign: Signer) =>
  <Result = string, StartResult = string>(
    initContext: MPCWebsocketStarter<StartResult>,
    handleStepping: MPCWebsocketHandler<StartResult, Result>
  ): ResultAsync<Result, AppError> => {
    return createNonce(baseUrl)
      .andThen(sign)
      .andThen(signResult => createRequestor({ signResult, baseUrl }))
      .andThen(initContext)
      .andThen(handleStepping)
      .mapErr(err => mapWebsocketToAppError(err));
  };

export const authWebsocketWithSetup =
  <InitParam = string, StartResult = string>(baseUrl: string, sign: Signer, initParam: InitParam) =>
  <Result>(
    initContext: MPCWebsocketStarterWithSetup<InitParam, StartResult>,
    handleStepping: MPCWebsocketHandler<StartResult, Result>
  ): ResultAsync<Result, AppError> => {
    return createNonce(baseUrl)
      .andThen(sign)
      .andThen(signResult => createRequestor({ signResult, baseUrl }))
      .andThen(axios => initContext({ axios, initParam: initParam }))
      .andThen(handleStepping)
      .mapErr(mapWebsocketToAppError);
  };

// For convenience we allow the init parameter to contain sensitive data like the share value
// we have to remove all sensitive data before sending it
export const cleanInitParam = <T>(initParam: T) => {
  if (typeof initParam === 'string') {
    return initParam;
  }

  const parameter = { ...initParam };
  if (typeof parameter === 'object' && parameter && 'share' in parameter) {
    delete parameter.share;
  }

  return parameter;
};
