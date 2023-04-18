import { fetchFrom, HttpMethod, HttpParams } from '../../base/http';

export const fetchFromZeroEx = async <T>(url: string, params?: HttpParams): Promise<T> => {
  if (!!params && !!params.method && params.method !== HttpMethod.GET) {
    const appendix = url.includes('?') ? '&' : '?';

    url = `${url}${appendix}`;
  }

  return fetchFrom(url, params);
};
