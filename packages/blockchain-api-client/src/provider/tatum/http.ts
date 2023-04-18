import { fetchFrom, HttpParams } from "../../base/http";
import { Network } from "../../base/types";

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
        "x-api-key": network === "MAIN" ? apiKeys.main : apiKeys.test,
      },
    },
  });
};

const apiKeys = {
  test: "",
  main: "",
};
