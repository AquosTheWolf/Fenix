import BaseCommand from "../structures/BaseCommand";
import { ApplicationCommandOptionData } from "discord.js";
import FenixClient from "../lib/FenixClient";

export const loadSlashCommand = (client: FenixClient, data: { category: string; command: BaseCommand }) => {
	if (!data.command || !data.command.name) return;
	client.commands.set(data.command.name, data.command);
	if (data.command.userPermissions.length > 0 || data.command.ownerOnly) data.command.defaultPermission = false;
	const commandOptions: ApplicationCommandOptionData[] = [];
	data.command.args?.forEach((arg) => {
		commandOptions.push({
			name: arg.name,
			description: arg.description,
			type: arg.type,
			choices: arg.choices,
			required: arg.required,
			// @ts-ignore
			options: arg.options,
		});
	});

	client.arrayOfSlashCommands.push({
		...data.command,
		options: commandOptions,
		run: data.command.run,
	});

	client._logger.info(`Loaded command ${data.command.name}`);
};
