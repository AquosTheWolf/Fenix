import { ColorResolvable, CommandInteraction, MessageEmbed } from "discord.js";
import FenixClient from "../../lib/FenixClient";
import BaseSlashCommand from "../../structures/BaseCommand";

export default class PingCommand extends BaseSlashCommand {
	constructor(client: FenixClient) {
		super(client, {
			name: "info",
			description: "Get the bot's information",
			args: [],
			userPermissions: [],
			botPermissions: [],
		});
	}
	async run(interaction: CommandInteraction) {
		const embed = new MessageEmbed()
			.setTitle("Information")
			.setDescription("Discord Bot made for Frenzy Furs!")
			.addField("GitHub", "Repository is Private at the moment 🙂")
			.addField("Bugs/Feature Request", `Please DM ${interaction.client.users.cache.get("852070153804972043")}!`)
			.addField("When will it be Public?", "We don't plan to make it public at the moment!")
			.setColor(this.client.config.color as ColorResolvable)
			.setThumbnail(interaction.guild?.iconURL({ dynamic: true })!)
			.setFooter(`Bot made by ${interaction.client.users.cache.get("852070153804972043")!.tag}`);
		interaction.reply({ embeds: [embed] });
	}
}
