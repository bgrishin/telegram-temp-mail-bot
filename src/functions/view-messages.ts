import { getEmailMessage } from "../messages/email.message";
import { client } from "../redis/client.redis";
import { Markup } from "telegraf";
import { requestUrl } from "../common/request-url";

export const viewMessages = async (bot, tempMail, messages) => {
  if (!messages.length) return;
  const [login, domain] = tempMail.email.split("@");
  await Promise.all(
    messages
      .filter((x) => !tempMail.ignoredMessages.some((k) => k === x.id))
      .map(async (msg) => {
        await bot.telegram.sendMessage(tempMail.chatId, getEmailMessage(msg), {
          parse_mode: "Markdown",
          ...Markup.inlineKeyboard(
            msg.attachments.map((attachment) => [
              Markup.button.url(
                `Download ${attachment.filename} attachment`,
                requestUrl +
                  `/api/v1/?action=download&login=${login}&domain=${domain}&id=${msg.id}&file=${attachment.filename}`
              ),
            ])
          ),
        });
        await client.set(
          tempMail.id,
          JSON.stringify({
            ...tempMail,
            ignoredMessages: [...tempMail.ignoredMessages, msg.id],
          }),
          {
            KEEPTTL: true,
          }
        );
      })
  );
};
