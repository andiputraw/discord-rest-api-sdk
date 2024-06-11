import type { IClient } from "../interfaces";
import type { APIMessage } from "discord-api-types/v10";
import { Message } from "../message/Message";
import type { Result } from "ts-results-es";
import type { DiscordErrorResponse } from "../types";
import type {
  SendMessageConfig,
  SendMessageParams,
} from "../interfaces/IMessage";

export class Channel {
  constructor(private client: IClient, private id: string) {}

  async send(
    content: SendMessageParams,
    config?: SendMessageConfig
  ): Promise<Result<Message, DiscordErrorResponse>> {
    const body = { ...content, ...config };

    return (
      await this.client.req.fetch<APIMessage>(
        `/channels/${this.id}/messages`,
        "POST",
        body
      )
    ).map((message) => new Message(this.client, message));
  }
}
