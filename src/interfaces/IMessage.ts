import type {
  APIEmbed,
  ComponentType,
  RESTPostAPIChannelMessageJSONBody,
} from "discord-api-types/v10";
import type { Components } from "../interfaces";

/**
 * At least one of the properties is required
 *
 * * Content - The message contents (up to 2000 characters).
 * * Embeds - An array of embeds to include in the message
 * * StickerIds - An array of custom stickers to include in the message
 * * Components - An array of components to include in the message
 * * Poll - A poll to include in the message
 */

export interface SendMessageParams
  extends Pick<
      RESTPostAPIChannelMessageJSONBody,
      "content" | "embeds" | "sticker_ids" | "poll"
    >,
    Components {}

export interface SendMessageConfig
  extends Omit<
    RESTPostAPIChannelMessageJSONBody,
    "content" | "embeds" | "sticker_ids" | "components" | "poll"
  > {}
