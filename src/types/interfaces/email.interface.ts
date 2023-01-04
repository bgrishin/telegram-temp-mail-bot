export interface Email {
  id: string;
  email: string;
  chatId: number;
  updateMessageId: number;
  ignoredMessages: number[];
  lastTime: string;
}
