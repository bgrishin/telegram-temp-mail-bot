export const getEmailStatus = (email, time) =>
  `📫 Your temp-mail is: *${email}*\n\nTemp-mail will expire in *${time}* minute(s). 🕓\n\nNew messages will appear below. 🔽`;

export const getExpiredEmailStatus = (email) =>
  `📫 Temp-mail *${email}* is expired. ⛔️\n\n🔄To generate new temp-mail press button below.`;

export const tempMailDenied = `⛔ You can't generate temp-mail because you already have one`;
