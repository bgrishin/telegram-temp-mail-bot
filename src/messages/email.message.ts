export const getEmailMessage = ({
  from,
  subject,
  date,
  textBody,
  attachments,
}) =>
  `👤 From: *${from}*\n🪧 Subject: *${subject}*\n📆 Date: *${date}*\n\n📌 Attachements: ${
    !attachments.length
      ? "*no attachements*"
      : attachments
          .map((attachement) => `\n\t\t*${attachement.filename}*`)
          .join("")
  }\n\n*${textBody}*`;
