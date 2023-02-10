import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { isTheMonitorRunning, setIsTheMonitorRunning } from "../../monitor/monitorState";
import { stopMonitor } from "../../monitor";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop-monit')
		.setDescription('Interrompe o monitoramento do bot.'),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		if (!isTheMonitorRunning) {
      await interaction.reply("O monitoramento já esta parado!");
      return;
    }

    stopMonitor();

    setIsTheMonitorRunning(false);
    await interaction.reply("Monitoramento interrompido!");
	},
};