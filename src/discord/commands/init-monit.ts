import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { isTheMonitorRunning, setIsTheMonitorRunning } from "../../monitor/monitorState";
import { initMonitor } from "../../monitor";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('init-monit')
		.setDescription('Inicia monitoramento do bot.'),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		if (isTheMonitorRunning) {
      await interaction.reply("O monitoramento já esta rodando!");
      return;
    }

    initMonitor();

    setIsTheMonitorRunning(true);
    await interaction.reply("Monitoramento iniciado!");
	},
};