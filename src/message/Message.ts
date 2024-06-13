import type { APIMessage, APIUser } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { IClient } from "../interfaces";
import type { APIResult } from "../types";
import type {
  SendMessageConfig,
  SendMessageParams,
} from "../interfaces/IMessage";
import { objectToQueryString } from "../util";

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

  async createReaction(emoji: string): Promise<APIResult<null>> {
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

  async deleteMyReaction(emoji: string): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelMessageOwnReaction(
        this.data.channel_id,
        this.data.id,
        emoji
      ),
      "DELETE",
      {}
    );
  }

  async deleteUserReaction(
    emoji: string,
    userId: string
  ): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelMessageUserReaction(
        this.data.channel_id,
        this.data.id,
        emoji,
        userId
      ),
      "DELETE",
      {}
    );
  }

  async deleteAllReactions(): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelMessageAllReactions(this.data.channel_id, this.data.id),
      "DELETE",
      {}
    );
  }

  async deleteAllReactionsForEmoji(emoji: string): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelMessageReaction(this.data.channel_id, this.data.id, emoji),
      "DELETE",
      {}
    );
  }

  async getReactions(
    emoji: string,
    config?: { type: number; after: string; limit: number }
  ): Promise<APIResult<APIUser[]>> {
    const query = objectToQueryString(config);
    return await this.client.req.fetch<APIUser[]>(
      Routes.channelMessageReaction(this.data.channel_id, this.data.id, emoji) +
        `?${query}`,
      "GET",
      {}
    );
  }
}
