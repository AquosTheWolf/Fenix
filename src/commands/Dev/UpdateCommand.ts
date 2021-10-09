import { exec } from "child_process";
import { CommandInteraction, MessageEmbed } from "discord.js";
import BaseSlashCommand from "../../structures/BaseCommand";
import FenixClient from '../../lib/FenixClient';

export default class UpdateCommand extends BaseSlashCommand {
	constructor(client: FenixClient) {
		super(client, {
			name: "update",
			description: "Update the Bot!",
			args: [],
			userPermissions: [],
			botPermissions: [],
			ownerOnly: true,
		});
	}
	async run(interaction: CommandInteraction) {
		// Sends an embed showing the it's updating the bot
		const embed = new MessageEmbed()
			.setAuthor(`${interaction.user.tag}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`)
			.setTitle("📥  Update - Updating bot...")
			.setColor("#ff1493"!)
			.setDescription("⏲️ This may take a bit...")
			.setTimestamp()
			.setFooter(`User ID: ${interaction.user.id}`);

		// Makes what is sent a message variable
		interaction.reply({ embeds: [embed] });
		exec("git stash", (err, res) => {
			if (err) throw new Error(err.message);
			embed.addField("📥 Git Stash", res);
		});

		exec("git pull origin master", (err, res) => {
			if (err) throw new Error(err.message);
			embed.addField("📥 Git Pull", res);
		});
		exec("yarn", (err, res) => {
			if (err) throw new Error(err.message);
			embed.addField("🧶 Yarn", res);
		});

		embed.setTitle("Update Complete!");
		await interaction.editReply({ embeds: [embed] });
	}
}