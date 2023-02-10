import { RequestInit } from "@lib/utils/fetch";

export type HttpParams = {
  args?: RequestInit;
  method?: HttpMethod;
  body?: any;
};

export enum HttpMethod {
  POST = "POST",
  GET = "GET",
}
