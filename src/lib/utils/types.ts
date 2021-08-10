import type { ApplicationCommandOptionChoice, ApplicationCommandOptionType } from 'discord.js';

export interface ICommandOptions {
	args?: ICommandArgsOptions[];
	cooldown?: number;
	extendedDescription?: string;
	group?: string;
	name?: string;
	ownerOnly?: boolean;
	registerAsSlashCommand?: boolean;
	runIn?: 'both' | 'dms' | 'servers';
	shortDescription: string;
	usage?: string;
}

export interface ICommandArgsOptions {
	acceptedValues?: ApplicationCommandOptionChoice[];
	description: string;
	name: string;
	optional?: boolean;
	options?: ICommandArgsOptions;
	type: ApplicationCommandOptionType;
}
