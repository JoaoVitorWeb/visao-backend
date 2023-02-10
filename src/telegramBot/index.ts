import { Telegraf } from "telegraf";
import { urls } from "../data/urls";
import { initMonitor, stopMonitor } from "../monitor";
import { isTheMonitorRunning, minutes, setIsTheMonitorRunning, setMinutes } from "../monitor/monitorState";

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

const chatId = process.env.TELEGRAM_CHAT_ID;

export class TelegramBot {
  static async init() {
    bot.command('init_monit', async context => {
      try {
        if (isTheMonitorRunning) {
          return context.reply("O monitoramento já esta rodando!");
        }
    
        initMonitor();

        setIsTheMonitorRunning(true);
    
        context.reply("Monitoramento iniciado!");
      } catch (error) {
        context.reply(`😧 Ocorreu um erro. Mensagem: ${error.message}`);
        console.log(error);
      }
    });

    bot.command('stop_monit', async context => {
      try {
        if (!isTheMonitorRunning) {
          return context.reply("O monitoramento já esta parado!");
        }
    
        stopMonitor();

        setIsTheMonitorRunning(false);
    
        context.reply("Monitoramento interrompido!");
      } catch (error) {
        context.reply(`😧 Ocorreu um erro. Mensagem: ${error.message}`);
        console.log(error);
      }
    });

    bot.command('list_sites', async context => {
      if (urls) {
        let sitesString = '';

        context.reply('🔎 Sites monitorados: 🔎');

        for (let index = 0; index < urls.length; index++) {
          sitesString += `${urls[index]} \n`;
        }

        await context.reply(sitesString);
      } else {
        await context.reply("Nenhum site para ser listado.");
      }
    });

    bot.command('timer', async context => {
      context.reply(`⌚ Intervalo entre cada verificação é de ${minutes} minutos ⌚`);
    });

    bot.command('status', async context => {
      if (isTheMonitorRunning) {
        return context.reply(`🤖 Status do bot: ON 🤖`);
      } 

      context.reply(`🤖 Status do bot: OFF 🤖`);
    });

    bot.command('commands', async context => {
      const commands = `/init_monit = Iniciar bot \n /stop_monit = Parar bot \n /status = Mostra o status do bot \n /list_site = Listar Sites monitorados \n /timer = Tempo de intevalo entre cada verificação \n /set_timer = Muda o intervalo entra cada verificação \n /commands = Listar comandos`;

      context.reply(commands);
    });

    bot.command('set_timer', async context => {
      try {
        const messageBody = context.message.text;
        const arrayOfString = messageBody.split(" ");
        const timerParameter = Number(arrayOfString[1]);

        if (typeof timerParameter !== "number" || isNaN(timerParameter)) {
          return context.reply("⚠ Comando inválido! Tente fazer desse jeito: \n\n /set_time 10");
        }

        setMinutes(timerParameter);

        context.reply(`⏳ Intervalo entre cada verificação definido para ${timerParameter} minutos`);
      } catch (error) {
        context.reply(`😧 Ocorreu um erro. Mensagem: ${error.message}`);
      }
    });

    await bot.launch();
    
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }

  static async sendMessage(message: string) {
    await bot.telegram.sendMessage(chatId, message);
  }
}

