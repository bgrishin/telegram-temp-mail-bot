import { createClient } from "redis";

export const client = createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await client.connect();
  await client.set("activeEmails", "[]");
})();
