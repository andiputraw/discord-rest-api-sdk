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
const logger = (...args: any[]) => {
  args.forEach((arg) => {
    if (typeof arg === "object") {
      console.log(JSON.stringify(arg, null, 2));
    } else {
      try {
        const parsedArg = JSON.parse(arg);
        console.log(JSON.stringify(parsedArg, null, 2));
      } catch (error) {
        console.log(arg);
      }
    }
  });
};

const client = new Client(TOKEN, { log: logger });

describe("test sending message and reaction", async () => {
  let testMessage: APIResult<Message>;
  let replyMessage: APIResult<Message>;
  let user: APIUser;

  test("send message", async () => {
    testMessage = await client
      .channel(CHANNEL)
      .sendMessage({ content: "This is a test" });
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

describe("test pin message", async () => {
  let pinnedMessage: Message;
  test("create pin message", async () => {
    const message = await (
      await client.channel(CHANNEL).sendMessage({
        content: "This is a pin message",
      })
    )
      .unwrap()
      .pin();

    expect(message.isOk()).toBeTruthy();
    await delay(1);
  });

  test("get pinned message", async () => {
    let messages = await client.channel(CHANNEL).getPinnedMessage();
    expect(messages.isOk()).toBeTruthy();
    pinnedMessage = messages.unwrap()[0];
    await delay(1);
  });

  test("unpin message", async () => {
    const response = await pinnedMessage.unpin();
    expect(response.isOk()).toBeTruthy();
    await delay(1);
  });
});
