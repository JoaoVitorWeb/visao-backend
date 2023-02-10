import { 
  Collection, 
  Events, 
  GatewayIntentBits,
  REST,
  Routes,
  TextChannel,
} from 'discord.js';
import fs from 'fs';
import path from 'path';
import { CustomClient } from './CustomClient';
import { commands } from './commands/commandsArray';

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

const client = new CustomClient(
  { intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ] 
});

client.commands = new Collection();

export class DiscordBot {
  static async init() {
    client.once(Events.ClientReady, (client) => {
      console.log('Ready! ' + client.user.username);
    });

    const commandsPath = path.join(__dirname, 'commands');
    let commandFiles: string[];
    
    commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    if (commandFiles.length === 0) {
      commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    }

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }

    client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;

      // @ts-ignore
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    });

    try {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    } catch (error) {
      console.error(error);
    }

    client.login(process.env.DISCORD_TOKEN);
  }

  static sendMessageToChannel(message: string) {
    const channel = client.channels.cache.get(process.env.DISCORD_CHAT_ID);

    (channel as TextChannel).send(message);
  }
}