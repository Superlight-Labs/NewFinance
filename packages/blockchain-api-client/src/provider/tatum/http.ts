import { fetchFrom, HttpParams } from '../../base/http';
import { Network } from '../../base/types';

export const fetchFromTatum = async <T>(
  url: string,
  network: Network,
  params?: HttpParams
): Promise<T> => {
  return fetchFrom(url, {
    ...params,
    args: {
      ...params?.args,
      headers: {
        ...params?.args?.headers,
        'x-api-key': network === 'main' ? apiKeys.main : apiKeys.test,
      },
    },
  });
};

const apiKeys = {
  test: process.env.TATUM_TEST_TOKEN || '',
  main: process.env.TATUM_MAIN_TOKEN || '',
};
