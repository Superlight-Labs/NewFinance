import { fetchFrom, HttpMethod, HttpParams } from "../../base/http";

export const fetchFromBlockCypher = async <T>(
  url: string,
  params?: HttpParams
): Promise<T> => {
  if (!!params && !!params.method && params.method !== HttpMethod.GET) {
    const appendix = url.includes("?") ? "&" : "?";

    url = `${url}${appendix}token=${apiKey}`;
  }

  return fetchFrom(url, params);
};

const apiKey = process.env.BLOCKCYPHER_API_KEY || "";
