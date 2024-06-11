import type { IDiscordHttpRequest } from "./IDiscordHttpRequest";

export type BotMetadata = {
  bot_name: string;
  bot_url: string;
  bot_version: string;
};

export type ClientConfiguration = {
  bot_metadata?: BotMetadata;
  httpClient?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response>;
  log: (...args: any[]) => void;
};

export interface IClient {
  token: string;
  config: Required<ClientConfiguration>;
  req: IDiscordHttpRequest;
}
