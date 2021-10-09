import beautify from "beautify";
import { CommandInteraction, MessageEmbed } from "discord.js";
import FenixClient from "../../lib/FenixClient";
import BaseSlashCommand from "../../structures/BaseCommand";

export default class EvalCommand extends BaseSlashCommand {
	constructor(client: FenixClient) {
		super(client, {
			name: "eval",
			description: "Evaluate some Node.js Code!",
			args: [
				{
					name: "code",
					description: "NodeJS Code you'd want to evaluate",
					type: "STRING",
					required: true,
				},
			],
			userPermissions: [],
			botPermissions: [],
			ownerOnly: true,
		});
	}
	async run(interaction: CommandInteraction) {
		const script = interaction.options.getString("code", true);
		try {
			const evaluated = eval(script);
			const evaled = require("util").inspect(evaluated, { depth: 5 });
			const promisedEval: any = await Promise.resolve(evaluated);
			let res = evaled.toString().length >= 1024 ? "Too Big to Display" : evaled;
			let promisedResult = promisedEval.toString().length >= 1024 ? "Too Big to Display" : promisedEval;
			// Process the output
			const embed = new MessageEmbed()
				.setAuthor(`${interaction.user.tag}`, `${interaction.user.displayAvatarURL({ dynamic: true })}`)
				.setTitle("Evaluated Code")
				.setColor("#ff1493"!)
				.setTimestamp()
				.addField(":inbox_tray: Input: ", `\`\`\`ts\n${beautify(script, { format: "js" })} \`\`\``)
				.addField(":outbox_tray: Output", `\`\`\`ts\n${res}\`\`\``)
				.setFooter(`User ID: ${interaction.user.id}`)
				.setThumbnail(this.client!.user?.displayAvatarURL({ dynamic: true })!);
			if (evaluated && evaluated.then) {
				embed.addField(":outbox_tray: Promise Output", `\`\`\`js\n${promisedResult}\`\`\``);
			}

			// Add a type of what is the type of what's evaluated
			embed.addField("Type of: ", `\`\`\`${typeof evaluated}\`\`\``);

			// Sends the embed
			await interaction.reply({ embeds: [embed], ephemeral: true });
		} catch (err: any) {
			// If any errors occurred... then, send the error instead
			throw new Error(err);
		}
	}
}
