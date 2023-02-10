import { RequestInfo, RequestInit, Response } from "node-fetch";

export type { RequestInfo, RequestInit, Response };
export type Fetch = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

// Workaround for typescript to accept global fetch
export default (global as any).fetch as Fetch;
