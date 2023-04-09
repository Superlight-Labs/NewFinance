import { MPCWebscocketInit, MPCWebsocketMessage, MPCWebsocketResult } from '@superlight/mpc-common';
import { Observable } from 'rxjs';
import { User } from 'src/repository/user';

type MPCWebsocketHandler<T> = (
  user: User,
  message: Observable<MPCWebsocketMessage>
) => MPCWebsocketResult<T>;

type MPCWebsocketWithInitParameterHandler<T, U> = (
  user: User,
  message: Observable<MPCWebsocketMessage>,
  initParameter: MPCWebscocketInit<U>
) => MPCWebsocketResult<T>;
