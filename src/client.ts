import { isCallChain } from "typescript";
import { Channel } from "./channel/Channel";
import { DiscordHttpRequest } from "./httpRequest/DiscordHttpRequest";
import type {
  ClientConfiguration,
  IClient,
  IDiscordHttpRequest,
} from "./interfaces";

const defaultClientConfiguration: Required<ClientConfiguration> = {
  httpClient: fetch,
  bot_metadata: {
    bot_name: "Bot",
    bot_url: "",
    bot_version: "v0.0.1",
  },
  log(...args) {},
};

export class Client implements IClient {
  public config: Required<ClientConfiguration>;
  public req: IDiscordHttpRequest;
  constructor(public token: string, config?: ClientConfiguration) {
    this.config = {
      ...defaultClientConfiguration,
      ...config,
    };
    this.req = new DiscordHttpRequest(this.token, this.config);
  }

  /**
   * Creates a new Channel instance with the provided ID.
   *
   * ```ts
   * const client = new Client("TOKEN")
   * const channel = client.channel("123456789012345678")
   * ```
   *
   * @param {string} id - The ID of the channel.
   * @return {Channel} A new Channel instance.
   */
  channel(id: string): Channel {
    return new Channel(this, id);
  }
}
