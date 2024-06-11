import { expect, describe, test } from "bun:test";
import { Client } from "../src/client";
import { delay } from "../src/util";
import type { APIResult, Message } from "../mod";

const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;

if (!TOKEN || !CHANNEL) {
  throw new Error("token or channel is not set");
}

describe("test channel functionanilty", async () => {
  const client = new Client(TOKEN, { log: (v) => console.log(v) });

  let testMessage: APIResult<Message>;
  let replyMessage: APIResult<Message>;

  test("send message", async () => {
    testMessage = await client
      .channel(CHANNEL)
      .send({ content: "This is a test" });
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
    replyMessage = await testMessage
      .unwrap()
      .reply({ content: "This is a reply" });
    expect(replyMessage.isOk()).toBeTruthy();
    await delay(1);
  });

  test("add reaction", async () => {
    const reaction = await replyMessage.unwrap().addReaction(encodeURI("👍"));
    expect(reaction.isOk()).toBeTruthy();
    await delay(1);
  });

  test("delete message", async () => {
    const response = await testMessage.unwrap().delete();
    expect(response.isOk()).toBeTruthy();
    await delay(1);
  });
});
