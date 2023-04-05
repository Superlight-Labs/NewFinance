import { MPCWebsocketResult } from '@superlight/mpc-common';
import { Observable } from 'rxjs';
import { User } from 'src/repository/user';
import { RawData } from 'ws';

type MPCWebsocketHandler<T> = (user: User, message: Observable<RawData>) => MPCWebsocketResult<T>;
type MPCWebsocketWithInitParameterHandler<T> = (
  user: User,
  message: Observable<RawData>,
  initParameter: RawData
) => MPCWebsocketResult<T>;
