import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { urls } from "../../data/urls";
import { DiscordBot } from '../main';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list-sites')
		.setDescription('Lista sites que estão sob monitoramento.'),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    if (urls) {
      let sitesString = '';

      await interaction.reply('🔎 Sites monitorados: 🔎');

      for (let index = 0; index < urls.length; index++) {
        sitesString += `${urls[index]} \n`;
      }

      DiscordBot.sendMessageToChannel(sitesString);
    } else {
      await interaction.reply("Nenhum site para ser listado.");
    }
	},
};