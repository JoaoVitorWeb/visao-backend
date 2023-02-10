import axios, { AxiosError } from "axios";
import { MonitorModule } from './monitorModule';
import { urls } from "../data/urls";
import { minutes, warningTimeInHours } from "./monitorState";
import { TelegramBot } from "../telegramBot";
import { DiscordBot } from "../discord/main";
import { warningMessages } from "../data/warningMessages";

const fetchInterval = 1000 * 60 * minutes;
const warningIntervalTime = 1000 * 60 * 60 * warningTimeInHours;

let siteMonitTimer = null;
let warningTimer = null;

const fetchUrlRecursively = async (url: string) => {
  if (minutes < 10) {
    stopMonitor();
    
    TelegramBot.sendMessage("Por segurança, o tempo de monitoramento deve ser de no minimo cada 10 minutos.");

    return;
  }

  axios.get(url).catch((error: AxiosError) => {
    MonitorModule.handle(url, error);
  });

  siteMonitTimer = setTimeout(() => {
    fetchUrlRecursively(url);
  }, fetchInterval);
}

export function initMonitor() {
  urls.forEach(url => fetchUrlRecursively(url));

  warningTimer = setInterval(() => {
    const message = warningMessages[Math.floor(Math.random()*warningMessages.length)];

    DiscordBot.sendMessageToChannel(message);
    TelegramBot.sendMessage(message);
  }, warningIntervalTime);

  console.log("Monitoramento iniciado!");
  console.log(`Intervalo: ${minutes} minutos.`);
}

export function stopMonitor() {
  clearTimeout(siteMonitTimer);
  clearInterval(warningTimer);

  console.log("Monitoramento interrompido!");
}


