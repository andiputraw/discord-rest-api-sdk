import type { APIMessage } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { IClient } from "../interfaces";
import type { APIResult } from "../types";
import type {
  SendMessageConfig,
  SendMessageParams,
} from "../interfaces/IMessage";

export class Message {
  constructor(private client: IClient, public data: APIMessage) {}

  async delete(): Promise<APIResult<null>> {
    return await this.client.req.fetch(
      `/channels/${this.data.channel_id}/messages/${this.data.id}`,
      "DELETE",
      {}
    );
  }

  async edit(
    content: SendMessageParams,
    config?: SendMessageConfig
  ): Promise<APIResult<Message>> {
    const body = { ...content, ...config };

    return (
      await this.client.req.fetch<APIMessage>(
        `/channels/${this.data.channel_id}/messages/${this.data.id}`,
        "PATCH",
        body
      )
    ).map((message) => new Message(this.client, message));
  }

  async reply(
    content: SendMessageParams,
    config?: SendMessageConfig
  ): Promise<APIResult<Message>> {
    const body = {
      ...content,
      ...config,
      message_reference: { message_id: this.data.id },
    };

    return (
      await this.client.req.fetch<APIMessage>(
        `/channels/${this.data.channel_id}/messages`,
        "POST",
        body
      )
    ).map((message) => new Message(this.client, message));
  }

  async addReaction(emoji: string): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelMessageOwnReaction(
        this.data.channel_id,
        this.data.id,
        emoji
      ),
      "PUT",
      {}
    );
  }
}
