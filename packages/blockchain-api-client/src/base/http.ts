import fetch, { RequestInit } from 'node-fetch';

export type Fetch = <T>(url: string, params?: HttpParams) => Promise<T>;

export enum HttpMethod {
  POST = 'POST',
  GET = 'GET',
}

export const fetchFrom = async <T>(url: string, params?: HttpParams): Promise<T> => {
  const { body, method, args } = params || {};

  const response = await fetch(url, {
    method: determineMethod(body, method),
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...args?.headers,
    },
  });

  const content = (await response.json()) as T;

  if (!response.ok) {
    console.error('Error from API, possibly show snackbar', content);
  }

  return content;
};

const determineMethod = (body?: any, method?: HttpMethod): HttpMethod => {
  if (!!method) return method;

  if (body) return HttpMethod.POST;

  return HttpMethod.GET;
};

export type HttpParams = {
  args?: RequestInit;
  method?: HttpMethod;
  body?: any;
};
