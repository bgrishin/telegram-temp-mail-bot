import { Context, Markup, Telegraf } from "telegraf";
import { Update } from "typegram";
import { startMessage } from "./messages/start.message";

import "dotenv/config";
import { Keyboard } from "./types/enums/keyboard.enum";
import { generateTempMail } from "./functions/generate-temp-mail";
import { client } from "./redis/client.redis";
import * as cron from "node-cron";
import { Email } from "./types/interfaces/email.interface";
import { getMessages } from "./utils/get-messages";
import { secondsToMinutes } from "./utils/seconds-to-minutes";
import {
  getEmailStatus,
  getExpiredEmailStatus,
} from "./messages/status.message";
import { viewMessages } from "./functions/view-messages";
import { aboutMessage } from "./messages/about.message";
import { Redis } from "./types/enums/redis.enum";
import { Regenerate } from "./types/enums/regenerate.enum";

const bot: Telegraf<Context<Update>> = new Telegraf(
  process.env.BOT_TOKEN as string
);

bot.start((ctx) =>
  ctx.reply(
    startMessage,
    Markup.keyboard([[Keyboard.GENERATE, Keyboard.ABOUT]])
      .oneTime()
      .resize()
  )
);

bot.hears(Keyboard.GENERATE, generateTempMail);
bot.action(Regenerate.callback, generateTempMail);

bot.hears(Keyboard.ABOUT, (ctx) =>
  ctx.reply(aboutMessage, { parse_mode: "HTML" })
);

bot.launch().then(() => console.log("Bot has started. 🚀"));

cron.schedule("* * * * *", async () => {
  const keys = await client.keys("*");

  const activeEmails = JSON.parse(await client.get(Redis.activeEmails));

  const checkedMarkets = await Promise.all(
    activeEmails.map(async (activeEmail) => {
      const isExpired = await client.get(activeEmail.id);

      if (!isExpired) {
        await bot.telegram.deleteMessage(
          activeEmail.chatId,
          activeEmail.updateMessageId
        );
        await bot.telegram.sendMessage(
          activeEmail.chatId,
          getExpiredEmailStatus(activeEmail.email),
          {
            parse_mode: "Markdown",
            ...Markup.inlineKeyboard([
              Markup.button.callback(Regenerate.message, Regenerate.callback),
            ]),
          }
        );
        return undefined;
      }
      return activeEmail;
    })
  );

  await client.set(
    Redis.activeEmails,
    JSON.stringify(checkedMarkets.filter((x) => x))
  );

  keys.map(async (key) => {
    if (key === Redis.activeEmails) return;
    let tempMail: Email = JSON.parse(await client.get(key));

    const messages = await getMessages(tempMail.email);

    const ttl = await client.ttl(tempMail.id);

    await viewMessages(bot, tempMail, messages);

    tempMail = JSON.parse(await client.get(tempMail.id));

    if (tempMail.lastTime === secondsToMinutes(ttl)) return;

    await bot.telegram.editMessageText(
      tempMail.chatId,
      tempMail.updateMessageId,
      tempMail.updateMessageId.toString(),
      getEmailStatus(tempMail.email, secondsToMinutes(ttl)),
      { parse_mode: "Markdown" }
    );

    await client.set(
      tempMail.id,
      JSON.stringify({ ...tempMail, lastTime: secondsToMinutes(ttl) }),
      {
        KEEPTTL: true,
      }
    );
  });
});
