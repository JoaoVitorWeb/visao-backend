import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		await interaction.reply('Pong!');
	},
};