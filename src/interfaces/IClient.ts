import type { IDiscordHttpRequest } from "./IDiscordHttpRequest";

export type BotMetadata = {
  bot_name: string;
  bot_url: string;
  bot_version: string;
};
/**
 * Optional configuration for the {@link Client}.
 */
export type ClientConfiguration = {
  /**
   * Optional metadata for the bot. it is used for the User-Agent header.
   */
  bot_metadata?: BotMetadata;
  /**
   * Custom HTTP client. By default, the global WebStandard {@link fetch} is used.
   */
  httpClient?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response>;
  /**
   * A function that logs messages to the console.
   */
  log: (...args: any[]) => void;
};

export interface IClient {
  token: string;
  config: Required<ClientConfiguration>;
  req: IDiscordHttpRequest;
}
