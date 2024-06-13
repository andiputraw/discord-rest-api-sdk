import type { IClient } from "../interfaces";
import { Routes, type APIMessage } from "discord-api-types/v10";
import { Message } from "../message/Message";
import type { APIResult } from "../types";
import type {
  SendMessageConfig,
  SendMessageParams,
} from "../interfaces/IMessage";

/**
 * a class representing a channel in discord.
 *
 * altough you can create a channel directly using the constructor, it is recomendded to use {@link Client.channel}
 *
 * ```ts
 * // create a channel object
 * const channel = client.channel("123456789012345678")
 * const message = await channel.sendMessage({ content: "Hello, World!" })
 *
 * ```
 *
 */
export class Channel {
  constructor(private client: IClient, private id: string) {}
  /**
   * Sends a message to the channel.
   *
   * ```ts
   * const channel = client.channel("123456789012345678")
   * const message = await channel.sendMessage({ content: "Hello, World!" })
   * ```
   *
   * required permissons:
   * * SEND_MESSAGES when operating in a guild channel
   * * SEND_TTS_MESSAGES if tts is set to true
   * @param {SendMessageParams} content - The content of the message.
   * @param {SendMessageConfig} [config] - Optional configuration for the message.
   * @return {Promise<APIResult<Message>>} A promise that resolves to a result containing the sent message or an error response.
   */
  async sendMessage(
    content: SendMessageParams,
    config?: SendMessageConfig
  ): Promise<APIResult<Message>> {
    const body = { ...content, ...config };

    return (
      await this.client.req.fetch<APIMessage>(
        Routes.channelMessages(this.id),
        "POST",
        body
      )
    ).map((message) => new Message(this.client, message));
  }
  /**
   * Retrieves the pinned messages of the channel.
   *
   * @return {Promise<APIResult<Message[]>>} A promise that resolves to a result containing an array of pinned messages.
   */
  async getPinnedMessage(): Promise<APIResult<Message[]>> {
    return (
      await this.client.req.fetch<APIMessage[]>(
        Routes.channelPins(this.id),
        "GET"
      )
    ).map((messages) => messages.map((m) => new Message(this.client, m)));
  }
}
