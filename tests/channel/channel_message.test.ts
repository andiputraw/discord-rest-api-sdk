import { expect, describe, test } from "bun:test";
import { Client } from "../../src/client";
import { delay } from "../../src/util";
import { EmbedBuilder } from "../../src/message/EmbedBuilder";
import { logger } from "../logger";
import {
  ActionRow,
  Button,
  SelectOption,
  ButtonStyle,
  CreateComponent,
  StringSelect,
} from "../../src/message/components";
const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;

if (!TOKEN || !CHANNEL) {
  throw new Error("token or channel is not set");
}

const client = new Client(TOKEN, { log: logger("test message") });

describe("test message", async () => {
  test("embed message", async () => {
    const embed = new EmbedBuilder()
      .setTitle("This is embed test")
      .setDescription("This is embed description")
      .setAuthor("Andiputraw")
      .setColor(0xff0000)
      .setThumbnail(
        "https://static.wikia.nocookie.net/gensin-impact/images/6/6a/Barbara_Icon.png/revision/latest?cb=20231215091800"
      )
      .addField("Field 1", "value 1")
      .addField("Field 2", "value 2", { inline: true })
      .build();

    const message = await client
      .channel(CHANNEL)
      .sendMessage({ content: "This is a test", embeds: [embed] });
    expect(message.isOk()).toBeTruthy();
    await delay(1);
  });
});

describe("test component message", async () => {
  const components = CreateComponent(
    ActionRow(
      StringSelect(
        "selection",
        {},
        SelectOption("Mage", "1", {
          default: true,
          description: "Mage is the best!",
        }),
        SelectOption("Warrior", "2", { description: "Warrior is the best!" })
      )
    ),
    ActionRow(
      Button("Go to Google", ButtonStyle.Link, { url: "https://google.com" }),
      Button("This is useless button", ButtonStyle.Danger, {
        custom_id: "button",
      })
    )
  ).unwrap();

  test("component message", async () => {
    const message = await client
      .channel(CHANNEL)
      .sendMessage({ content: "This is a test", components });
    expect(message.isOk()).toBeTruthy();
    await delay(1);
  });
});
