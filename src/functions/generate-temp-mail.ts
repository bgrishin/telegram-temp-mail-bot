import { getRandomEmail } from "../utils/get-random-email";
import { getEmailStatus, tempMailDenied } from "../messages/status.message";
import { getUniqueId } from "../utils/get-unique-id";
import { client } from "../redis/client.redis";
import { Redis } from "../types/enums/redis.enum";

export const generateTempMail = async (ctx) => {
  const randomEmail = await getRandomEmail();
  const activeEmails = JSON.parse(await client.get(Redis.activeEmails));

  if (activeEmails.some((x) => x.chatId === ctx.chat.id)) {
    ctx.reply(tempMailDenied);
    return;
  }

  const message = await ctx.reply(getEmailStatus(randomEmail, "10"), {
    parse_mode: "markdown",
  });

  const uniqueId = getUniqueId();
  const id = "email:" + uniqueId;

  await client.set(
    id,
    JSON.stringify({
      id: id,
      email: randomEmail,
      chatId: ctx.chat.id,
      updateMessageId: message.message_id,
      ignoredMessages: [],
      lastTime: 10,
    })
  );
  await client.expire(id, 600);
  await client.set(
    Redis.activeEmails,
    JSON.stringify([
      ...activeEmails,
      {
        id,
        email: randomEmail,
        chatId: ctx.chat.id,
        updateMessageId: message.message_id,
      },
    ])
  );
};
