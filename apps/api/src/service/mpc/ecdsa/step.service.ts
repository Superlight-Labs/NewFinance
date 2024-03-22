import { Context } from '@crypto-mpc';
import { MPCRouteResult } from '@lib/routes/rest/rest-types';
import { step } from '@lib/utils/crypto';
import { mpcInternalError, other } from '@superlight-labs/mpc-common';
import { OnSuccess, StepRequest } from '@superlight-labs/mpc-common/src/schema';
import { errAsync, okAsync } from 'neverthrow';
import { User } from 'src/repository/user';
import { SuccessHandler } from './step-success.handler';

export const handleStep = (req: StepRequest, user: User): MPCRouteResult => {
  if (!user.deriveContext) {
    return errAsync(other('User has no derive context'));
  }
  const context = Context.fromBuffer(user.deriveContext);

  return performSetp(Buffer.from(req.message), context, user, req.onSuccess, req.path);
};

const performSetp = (
  message: Buffer,
  context: Context,
  user: User,
  onSuccess: OnSuccess,
  path?: string
): MPCRouteResult => {
  const stepOutput = step(message, context);

  if (stepOutput.type === 'inProgress') {
    return okAsync({
      user,
      message: stepOutput.message,
      context,
    });
  }

  if (stepOutput.type === 'success') {
    return SuccessHandler[onSuccess](context, user, path);
  }

  if (stepOutput.type === 'error') {
    context.free();
    return errAsync(mpcInternalError(stepOutput.error, 'Error while stepping in context'));
  }

  return errAsync(other('Unexpected step output'));
};
