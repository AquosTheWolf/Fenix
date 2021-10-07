import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import FenixClient from "../../lib/FenixClient";
import BaseCommand from "../../structures/BaseCommand";

export default class PingCommand extends BaseCommand {
	constructor(client: FenixClient) {
		super(client, {
			name: "ping",
			botPermissions: [],
			description: "Ping the bot!",
			userPermissions: [],
			args: [],
		});
	}
	async run(interaction: CommandInteraction) {
		const reply = await interaction.channel!.send("Pinging");
		const embed = new MessageEmbed()
			.setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
			.setColor(this.client.config.color as ColorResolvable)
			.addField("Message Latency", `${Math.floor(reply.createdTimestamp - interaction.createdTimestamp)}ms`)
			.addField("API Latency", `${this.client.ws.ping}ms`)
			.setFooter(
				`If there's an Issue please report them to ${
					this.client.users.cache.get(this.client.config.owner)?.tag
				}`
			);
		reply.delete();
		interaction.reply({ embeds: [embed] });
	}
}
