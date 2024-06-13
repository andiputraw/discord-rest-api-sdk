import type { APIMessage, APIUser } from "discord-api-types/v10";
import { Routes } from "discord-api-types/v10";
import type { IClient } from "../interfaces";
import type { APIResult } from "../types";
import type {
  SendMessageConfig,
  SendMessageParams,
} from "../interfaces/IMessage";
import { objectToQueryString } from "../util";

type getReactionsParams = {
  limit?: number;
  after?: string;
  before?: string;
};

/**
 * a class representing a message in discord.
 *
 * altough you can create a message directly using the constructor, it is recomendded to use {@link Channel.sendMessage}
 *
 * ```ts
 * // create a message object
 * const channel = client.channel("123456789012345678")
 * // send a message
 * const message = channel.sendMessage({ content: "Hello, World!" })
 * // edit the message
 * const message = await message.edit({ content: "Hello, World!" })
 *
 * ```
 */
export class Message {
  constructor(private client: IClient, public data: APIMessage) {}
  /**
   * Deletes the message from the channel.
   *
   * Required Permissions:
   * * MANAGE_MESSAGES when operating in a guild channel and author is not the current user
   *
   * @return {Promise<APIResult<null>>} A Promise representing the API result of the deletion.
   */
  async delete(): Promise<APIResult<null>> {
    return await this.client.req.fetch(
      `/channels/${this.data.channel_id}/messages/${this.data.id}`,
      "DELETE",
      {}
    );
  }
  /**
   * Edits the message content. Note that this function return a new Message object, rendering the previous Message used to call this function outdated but not invalid.
   *
   * Required Permissions:
   *
   * * MANAGE_MESSAGES if trying to update flags of other message sent by other user.
   *
   * @param {SendMessageParams} content - The new content of the message.
   * @param {SendMessageConfig} [config] - Optional configuration for the message.
   * @return {Promise<APIResult<Message>>} A promise that resolves to a result containing the updated message or an error response.
   */
  async edit(
    content: SendMessageParams,
    config?: SendMessageConfig
  ): Promise<APIResult<Message>> {
    const body = { ...content, ...config };

    return (
      await this.client.req.fetch<APIMessage>(
        Routes.channelMessage(this.data.channel_id, this.data.id),
        "PATCH",
        body
      )
    ).map((message) => new Message(this.client, message));
  }

  /**
   * Replies to the message with the given content and optional configuration.
   *
   * Required Permissions:
   * * READ_MESSAGE_HISTORY
   * @param {SendMessageParams} content - The content of the reply message.
   * @param {SendMessageConfig} [config] - Optional configuration for the reply message.
   * @return {Promise<APIResult<Message>>} A promise that resolves to a result containing the sent reply message or an error response.
   */
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
        Routes.channelMessages(this.data.channel_id),
        "POST",
        body
      )
    ).map((message) => new Message(this.client, message));
  }
  /**
   * Creates a reaction for the current message using the specified emoji. you should encode the emoji with {@link encodeURI} yourself.
   *
   * for custom emoji. the emoji format should be `emojiId:emojiName`.
   *
   * ```ts
   * const message = await channel.sendMessage({ content: "Hello, World!" })
   * await message.createReaction(enocdeURI("👍"))
   * await message.createReaction(enocdeURI("1023904812:happy_face"))
   * ```
   *
   * Required Permissions:
   * * READ_MESSAGE_HISTORY
   * * ADD_REACTIONS if no one has reacted to the message
   *
   * @param {string} emoji - The emoji to create the reaction with.
   * @return {Promise<APIResult<null>>} A promise that resolves to an API result with no data on success, or an error response on failure.
   */
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
  /**
   * Deletes reaction created by bot for the current message.
   *
   * @param {string} emoji - The emoji to delete the reaction with.
   * @return {Promise<APIResult<null>>} A promise that resolves to an API result with no data on success, or an error response on failure.
   */
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
  /**
   * Deletes the reaction made by a user on a message using the specified emoji.
   *
   * Required Permissions:
   * * MANAGE_MESSAGES
   * @param {string} emoji - The emoji used in the reaction.
   * @param {string} userId - The ID of the user whose reaction is being deleted.
   * @return {Promise<APIResult<null>>} A promise that resolves to an API result with no data on success, or an error response on failure.
   */
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
  /**
   * Deletes all reactions from the message.
   *
   * Required Permissions:
   * * MANAGE_MESSAGES
   *
   * @return {Promise<APIResult<null>>} A promise that resolves to an API result with no data on success, or an error response on failure.
   */
  async deleteAllReactions(): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelMessageAllReactions(this.data.channel_id, this.data.id),
      "DELETE",
      {}
    );
  }
  /**
   * Deletes all reactions for a specific emoji on the message.
   *
   * Required Permissions:
   * * MANAGE_MESSAGES
   *
   * @param {string} emoji - The emoji to delete reactions for.
   * @return {Promise<APIResult<null>>} A promise that resolves to an API result with no data on success, or an error response on failure.
   */
  async deleteAllReactionsForEmoji(emoji: string): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelMessageReaction(this.data.channel_id, this.data.id, emoji),
      "DELETE",
      {}
    );
  }
  /**
   * Retrieves user who reacted for a specific emoji on the message.
   *
   * @param {string} emoji - The emoji to retrieve reactions for.
   * @param {getReactionParams} config - Optional configuration for the request.
   * @return {Promise<APIResult<APIUser[]>>} A promise that resolves to an API result containing an array of users who reacted with the specified emoji.
   */
  async getReactions(
    emoji: string,
    config?: getReactionsParams
  ): Promise<APIResult<APIUser[]>> {
    const query = objectToQueryString(config);
    return await this.client.req.fetch<APIUser[]>(
      Routes.channelMessageReaction(this.data.channel_id, this.data.id, emoji) +
        `?${query}`,
      "GET"
    );
  }
  /**
   * Pins the message in the channel.
   *
   * Required Permissions:
   * * MANAGE_MESSAGES
   *
   * @return {Promise<APIResult<null>>} A promise that resolves to an API result containing no data.
   */
  async pin(): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelPin(this.data.channel_id, this.data.id),
      "PUT"
    );
  }
  /**
   * Unpins the message in the channel. if the message is not pinned. it will do nothing and return a Ok result.
   *
   * Required Permissions:
   * * MANAGE_MESSAGES
   *
   * @return {Promise<APIResult<null>>} A promise that resolves to an API result containing no data.
   */
  async unpin(): Promise<APIResult<null>> {
    return await this.client.req.fetch<null>(
      Routes.channelPin(this.data.channel_id, this.data.id),
      "DELETE"
    );
  }
}
