import { isRouteError, RouteError } from '@lib/routes/rest/error';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';

export const getSafeResultAsync = <T>(
  unsafe: Promise<T | RouteError>,
  error: (e) => RouteError
): ResultAsync<T, RouteError> => {
  const unsafeResultAsync = ResultAsync.fromPromise(unsafe, error);

  return unsafeResultAsync.andThen(unsafeResult => {
    if (isRouteError(unsafeResult)) return errAsync(unsafeResult);

    return okAsync(unsafeResult);
  });
};
