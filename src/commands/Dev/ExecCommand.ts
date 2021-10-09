import { exec } from "child_process";
import { CommandInteraction, MessageEmbed } from "discord.js";
import FenixClient from "../../lib/FenixClient";
import BaseSlashCommand from "../../structures/BaseCommand";

export default class ExecCommand extends BaseSlashCommand {
	constructor(client: FenixClient) {
		super(client, {
			name: "exec",
			description: "Execute terminal stuff!",
			args: [
				{
					name: "command",
					description: "Command you would want the execute command to run",
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
		const disallowedScripts = [
			"reboot",
			"shutdown",
			"rm",
			"mv",
			"cp",
			"mkdir",
			"rmdir",
			"touch",
			"pwd",
			"clear",
			"/.|.&/",
			"restart/*  */",
		];
		const script = interaction.options.getString("command", true);
		if (!script) throw new Error("Please provide a command for me to execute");
		// Disallow certain scripts to be ran
		if (disallowedScripts.includes(script.toLowerCase()))
			throw new Error(
				"mkdir, restart, reboot, shutdown, rm, and dot based directory structures are not permitted."
			);

		// Execute the command
		exec(`${script}`, async (error, stdout) => {
			const response = error || stdout;
			try {
				const embed = new MessageEmbed()
					.setAuthor(
						`${interaction.user.tag}`,
						`${interaction.user.displayAvatarURL({
							dynamic: true,
						})}`
					)
					.setTitle("Execute")
					.setDescription(`**Ran: \`\`\`${script}\`\`\`**\n\`\`\`js\n${response.toString()} \n\`\`\``)
					.setThumbnail(
						this.client!.user?.displayAvatarURL({
							dynamic: true,
						})!
					)
					.setTimestamp()
					.setFooter(`User ID: ${interaction.user.id}`)
					.setColor("#ff1493"!);
				// Sends the embed with the response embed in it... Get it?
				await interaction.reply({ embeds: [embed] });
			} catch (e) {
				throw new Error(`${e}`);
			}
		});
	}
}
