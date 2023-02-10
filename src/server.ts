require('dotenv/config');

import express from "express";
import { DiscordBot } from "./discord/main";
import { TelegramBot } from "./telegramBot";

const port = 4002;
const app = express();

app.listen(port, () => {
  TelegramBot.init();
  DiscordBot.init();

  console.log(`Rodando na porta ${port}!`);
});
