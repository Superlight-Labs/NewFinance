import { ResultAsync } from 'neverthrow';
import { AppError, useSnackbarState } from 'state/snackbar.state';

export const useFailableAction = () => {
  const { setMessage } = useSnackbarState();

  const perform = <T>(result: ResultAsync<T, AppError>) => {
    return {
      onSuccess: (action: (value: T) => void) => {
        result.match(action, err => {
          console.log('Error performing action', err);
          setMessage(err);
        });

        return { andThen: perform };
      },
      andThen: perform,
    };
  };

  return {
    perform,
  };
};
