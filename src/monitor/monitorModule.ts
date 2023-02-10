import { AxiosError } from "axios";
import { acceptStatuses } from "../data/accept";
import { TelegramBot } from "../telegramBot";
import { DiscordBot } from '../discord/main';

export class MonitorModule {
  static handle(url: string, error: AxiosError) {
    const status = error;

    if (!acceptStatuses[url] || !acceptStatuses[url].includes(status)) {
      const message = `❌ A url ${url} retornou: '${status}'`

      TelegramBot.sendMessage(message);
      DiscordBot.sendMessageToChannel(message);
      console.error(message);
    }
  }
}
