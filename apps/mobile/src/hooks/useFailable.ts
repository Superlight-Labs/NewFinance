import { ResultAsync } from 'neverthrow';
import { AppError, useSnackbarState } from 'state/snackbar.state';

export const useFailableAction = () => {
  const { setMessage } = useSnackbarState();
  return {
    perform: <T>(result: ResultAsync<T, AppError>) => ({
      andThen: (action: (value: T) => void) => {
        result.match(action, err => setMessage(err));
      },
    }),
  };
};
