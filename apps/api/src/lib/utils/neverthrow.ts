import { isRouteError, RouteError } from '@lib/routes/rest/rest-error';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';

/* 
  TODO this method exists because some repository functions are returning RouteErrors 
  Instead the repository functions should return Promises and may throw exceptions.
  that way, this function will be obsolete.

  We want to remove it because it is a problem if we cannot trust that the success branch
  of an resultasync is actually a result
*/
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
