import { expect, describe, test } from "bun:test";
import { Client } from "../src/client";
import { delay } from "../src/util";

const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;

if (!TOKEN || !CHANNEL) {
  throw new Error("token or channel is not set");
}

describe("test channel functionanilty", async () => {
  const client = new Client(TOKEN);

  const testMessage = await client
    .channel(CHANNEL)
    .send({ content: "This is a test" });
  test("send message", async () => {
    expect(testMessage.isOk()).toBeTruthy();
    await delay(1);
  });

  test("edit message", async () => {
    const edited = await testMessage
      .unwrap()
      .edit({ content: "This is an edited test" });
    expect(edited.isOk()).toBeTruthy();
    await delay(1);
  });

  test("reply message", async () => {
    const reply = await testMessage
      .unwrap()
      .reply({ content: "This is a reply" });
    expect(reply.isOk()).toBeTruthy();
    await delay(1);
  });

  test("delete message", async () => {
    const response = await testMessage.unwrap().delete();
    expect(response.isOk()).toBeTruthy();
    await delay(1);
  });
});
