import { expect, describe, test } from "bun:test";
import { Client } from "../src/client";
import { delay } from "../src/util";
import type { APIResult, Message } from "../mod";
import type { APIUser } from "discord-api-types/v10";

const TOKEN = process.env.TOKEN;
const CHANNEL = process.env.CHANNEL;

if (!TOKEN || !CHANNEL) {
  throw new Error("token or channel is not set");
}

describe("test channel functionanilty", async () => {
  const client = new Client(TOKEN, { log: (v) => console.log(v) });

  let testMessage: APIResult<Message>;
  let replyMessage: APIResult<Message>;
  let user: APIUser;

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
    const emojis = ["👍", "👎", "🤞", "🖕", "🤟", "🤟"];

    const reactionsPromise = emojis.map((emoji) =>
      replyMessage.unwrap().createReaction(encodeURI(emoji))
    );

    const reactions = await Promise.all(reactionsPromise);

    for (const reaction of reactions) {
      expect(reaction.isOk()).toBeTruthy();
    }
    await delay(1);
  });

  test("get reactions", async () => {
    const reactions = await replyMessage.unwrap().getReactions(encodeURI("👍"));
    expect(reactions.isOk()).toBeTruthy();
    user = reactions.unwrap()[0];
    await delay(1);
  });

  test("remove reaction", async () => {
    const deleteMy = replyMessage.unwrap().deleteMyReaction(encodeURI("👍"));

    const deleteAllReactionForEmoji = replyMessage
      .unwrap()
      .deleteAllReactionsForEmoji(encodeURI("👎"));

    const deleteUserReaction = replyMessage
      .unwrap()
      .deleteUserReaction(encodeURI("🤞"), user.id);

    const reactions = await Promise.all([
      deleteMy,
      deleteAllReactionForEmoji,
      deleteUserReaction,
    ]);

    for (const reaction of reactions) {
      expect(reaction.isOk()).toBeTruthy();
    }
    await delay(1);

    const deleteAll = await replyMessage.unwrap().deleteAllReactions();

    expect(deleteAll.isOk()).toBeTruthy();

    await delay(1);
  });

  test("delete message", async () => {
    const response = await testMessage.unwrap().delete();
    expect(response.isOk()).toBeTruthy();
    await delay(1);
  });
});
