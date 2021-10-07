import { ApplicationCommandPermissions, Interaction, PermissionFlags, ApplicationCommandOptionChoice, CommandOptionDataTypeResolvable } from 'discord.js';
import FenixClient from "../lib/FenixClient";

export default abstract class BaseCommand {
	public client: FenixClient;
	public args?: ICommandArgsOptions[];
	public description: string;
	public name: string;
	public ownerOnly?: boolean;
	public userPermissions: Array<keyof PermissionFlags>;
	public botPermissions: Array<keyof PermissionFlags>;
	public permissions?: ApplicationCommandPermissions[];
	public defaultPermission: boolean;
	constructor(
		client: FenixClient,
		{ args, name, ownerOnly, description, userPermissions, botPermissions }: ICommandOptions
	) {
		this.client = client;
		this.args = args;
		this.name = name;
		this.ownerOnly = ownerOnly || false;
		this.description = description;
		this.userPermissions = userPermissions || [];
		this.botPermissions = botPermissions || [];
	}
	abstract run(interaction: Interaction): void;
}


interface ICommandOptions {
	args?: ICommandArgsOptions[];
	description: string;
	name: string;
	ownerOnly?: boolean;
	userPermissions: Array<keyof PermissionFlags>;
	botPermissions: Array<keyof PermissionFlags>;
}

interface ICommandArgsOptions {
	choices?: ApplicationCommandOptionChoice[];
	description: string;
	name: string;
	options?: ICommandArgsOptions[];
	required?: boolean;
	type: CommandOptionDataTypeResolvable;
}
