export const getEmailMessage = ({
  from,
  subject,
  date,
  textBody,
  attachments,
}) =>
  `👤 From: *${from}*\n🪧 Subject: *${subject}*\n📆 Date: *${date}*\n\n📌 Attachments: ${
    !attachments.length
      ? "*no attachments*"
      : attachments
          .map((attachment) => `\n\t\t*${attachment.filename}*`)
          .join("")
  }\n\n*${textBody}*`;
