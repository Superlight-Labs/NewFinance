import { AxiosInstance } from 'axios';
import { ResultAsync } from 'neverthrow';
import { AppError, WebsocketError } from 'src/error';

export type MPCStarterResult<T> = {
  res: T;
  axios: AxiosInstance;
};

export type MPCWebsocketStarter<StartRes> = (
  axios: AxiosInstance
) => ResultAsync<MPCStarterResult<StartRes>, WebsocketError>;

export type MPCWebsocketStarterWithSetup<InitParam, StartRes> = (
  params: StarterWithSetupParams<InitParam>
) => ResultAsync<MPCStarterResult<StartRes>, WebsocketError>;

export type MPCWebsocketHandlerWithSetup<Result, StartRes> = (
  params: MPCStarterResult<StartRes>
) => ResultAsync<Result, WebsocketError>;

export type StarterWithSetupParams<InitParam> = {
  axios: AxiosInstance;
  initParam: InitParam;
};

export type MPCWebsocketHandler<T, U> = (params: MPCStarterResult<T>) => ResultAsync<U, AppError>;

export type HandlerParams<U> = {
  startResult: ResultAsync<U, WebsocketError>;
};
