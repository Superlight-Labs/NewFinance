import logger from '@superlight-labs/logger';
import { AppError } from '@superlight-labs/mpc-common';
import { ResultAsync } from 'neverthrow';
import { useSnackbarState } from 'state/snackbar.state';

export const useFailableAction = () => {
  const { setMessage } = useSnackbarState();

  const perform = <T>(result: ResultAsync<T, AppError>, errFn?: ErrorFn) => {
    return {
      onSuccess: (action: (value: T) => void) => {
        result.match(action, err => {
          errFn && errFn();
          logger.error({ err }, 'Error performing action');
          setMessage(err);
        });
      },
    };
  };

  return {
    perform,
  };
};

type ErrorFn = () => void;
