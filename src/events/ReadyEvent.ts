import { GuildApplicationCommandPermissionData } from "discord.js";
import FenixClient from "../lib/FenixClient";
import BaseEvent from "../structures/BaseEvent";

export default class ReadyEvent extends BaseEvent {
	constructor(client: FenixClient) {
		super(client, {
			name: "ready",
			enabled: true,
			event: "ready"
		});
	}
	async run(client: FenixClient) {
		const guild = client.guilds.cache.get(client.config.guildID);
		if (!guild) {
			client._logger.error("Cannot find the guild!");
			process.exit();
		}
	
		const fullPerms: GuildApplicationCommandPermissionData[] = [];
		await guild!.commands.set(client.arrayOfSlashCommands).then(async (cmd) => {
			client._logger.info("Setting (/) Permissions");
			const getRoles = (cmdName: string) => {
				const permsRequired = client.arrayOfSlashCommands.find((x) => x.name === cmdName)!.userPermissions;
				if (permsRequired.length === 0) return;
				return guild?.roles.cache.filter((x) => x.permissions.has(permsRequired) && !x.managed);
			};

			const checkOwner = (cmdName: string) => {
				return client.arrayOfSlashCommands.find((x) => x.name === cmdName)!.ownerOnly;
			};

			cmd.forEach((command) => {
				if (checkOwner(command.name)) {
					fullPerms.push({
						id: command.id,
						permissions: [
							{
								id: this.client.config.owner,
								permission: true,
								type: "USER",
							},
						],
					});
				}

				const roles = getRoles(command.name);
				if (!roles) return;
				roles.forEach((role) => {
					let temp: GuildApplicationCommandPermissionData = {
						id: command.id,
						permissions: [
							{
								id: role.id,
								permission: true,
								type: "ROLE",
							},
						],
					};
					fullPerms.push(temp);
				});
			});
			guild?.commands.permissions.set({ fullPermissions: fullPerms });
		});
	}
}
