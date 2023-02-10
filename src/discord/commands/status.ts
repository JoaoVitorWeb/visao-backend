import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { isTheMonitorRunning } from "../../monitor/monitorState";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Retorna o status atual do bot.'),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    if (isTheMonitorRunning) {
      await interaction.reply(`🤖 O pai ta ON 🤖`);
      return;
    } 

    await interaction.reply(`🤖 Status do bot: OFF 🤖`);
	},
};