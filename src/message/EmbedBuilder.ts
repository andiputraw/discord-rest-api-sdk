import type {
  APIEmbed,
  APIEmbedAuthor,
  APIEmbedFooter,
  APIEmbedImage,
  APIEmbedThumbnail,
  APIEmbedVideo,
} from "discord-api-types/v10";

//adapted from https://github.com/discordeno/serverless-deno-deploy-template/blob/main/src/utils/Embed.ts
const embedLimits = {
  title: 256,
  description: 2048,
  fieldName: 256,
  fieldValue: 1024,
  footerText: 2048,
  authorName: 256,
  fields: 25,
  total: 6000,
} as const;

/**
 * A builder for APIEmbed objects. This class will ensure that the embed is not bigger than the limits. if the limit reached, the data will be shortened or not added.
 */
export class EmbedBuilder {
  #currentTotal = 0;
  #data: APIEmbed = {};
  constructor() {}
  private fitData(data: string, max: number) {
    // If the string is bigger then the allowed max shorten it.
    if (data.length > max) data = data.substring(0, max);
    // Check the amount of characters left for this embed
    const availableCharacters = embedLimits.total - this.#currentTotal;
    // If it is maxed out already return empty string as nothing can be added anymore
    if (!availableCharacters) return ``;
    // If the string breaks the maximum embed limit then shorten it.
    if (this.#currentTotal + data.length > embedLimits.total) {
      return data.substring(0, availableCharacters);
    }
    // Return the data as is with no changes.
    return data;
  }
  setTitle(title: string): this {
    this.#data.title = this.fitData(title, embedLimits.title);
    return this;
  }
  setUrl(url: string): this {
    this.#data.url = url;
    return this;
  }
  setDescription(desc: string): this {
    this.#data.description = this.fitData(desc, embedLimits.description);
    return this;
  }
  setThumbnail(url: string, option?: Omit<APIEmbedThumbnail, "url">): this {
    this.#data.thumbnail = {
      url: this.fitData(url, embedLimits.description),
      ...option,
    };
    return this;
  }

  setColor(color: number): this {
    this.#data.color = color;
    return this;
  }

  setTimestamp(timestamp: Date): this {
    this.#data.timestamp = timestamp.toISOString();
    return this;
  }
  addField(
    name: string,
    value: string,
    option: { inline?: boolean } = {}
  ): this {
    if (this.#data.fields === undefined) this.#data.fields = [];
    if (this.#data.fields.length === embedLimits.fields) return this;

    this.#data.fields.push({
      name: this.fitData(name, embedLimits.fieldName),
      value: this.fitData(value, embedLimits.fieldValue),
      inline: option?.inline ?? false,
    });

    return this;
  }
  getFieldCount(): number {
    return this.#data.fields?.length ?? 0;
  }
  setFooter(text: string, option?: Omit<APIEmbedFooter, "text">): this {
    this.#data.footer = {
      text: this.fitData(text, embedLimits.footerText),
      ...option,
    };
    return this;
  }

  setAuthor(name: string, option?: Omit<APIEmbedAuthor, "name">): this {
    this.#data.author = {
      name: this.fitData(name, embedLimits.authorName),
      ...option,
    };
    return this;
  }

  setImage(url: string, option?: Omit<APIEmbedImage, "url">): this {
    this.#data.image = {
      url,
      ...option,
    };
    return this;
  }

  setVideo(url: string, option?: Omit<APIEmbedVideo, "url">): this {
    this.#data.video = {
      url,
      ...option,
    };
    return this;
  }

  setProvider(name: string, url: string): this {
    this.#data.provider = {
      name,
      url,
    };
    return this;
  }
  getCurrentTextTotal(): number {
    return this.#currentTotal;
  }
  build(): APIEmbed {
    return this.#data;
  }
}
