export interface HttpError {
  statusCode: number;
  errorMsg: string;
}

export type WSClientMessage = Buffer | ArrayBuffer | Buffer[];
