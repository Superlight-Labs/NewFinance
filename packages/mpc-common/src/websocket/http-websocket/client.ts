import { AxiosInstance } from 'axios';
import { ReplaySubject } from 'rxjs';

export abstract class HttpWebsocket {
  public abstract send(data: string): Promise<void>;
  public abstract onMessage(callback: (data: string) => void): void;
  public abstract onError(callback: (err: unknown) => void): void;
}

export class HttpWebsocketClient extends HttpWebsocket {
  private result = new ReplaySubject<string>();
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    super();
    this.axios = axios;
  }

  public async send(data: string): Promise<void> {
    try {
      const result = await this.axios.post(data);
      this.result.next(result.data);
    } catch (err) {
      this.result.error(err);
    }
  }

  public onMessage(callback: (data: string) => void) {
    this.result.subscribe(callback);
  }

  public onError(callback: (err: unknown) => void) {
    this.result.subscribe({ error: callback });
  }
}
