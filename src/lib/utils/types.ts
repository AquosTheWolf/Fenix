import type { CommandOptionChoiceResolvableType, CommandOptionDataTypeResolvable } from 'discord.js';

export interface ICommandOptions {
	args?: ICommandArgsOptions[];
	cooldown?: number;
	extendedDescription?: string;
	group?: string;
	name?: string;
	ownerOnly?: boolean;
	runIn?: 'both' | 'dms' | 'servers';
	shortDescription: string;
	usage?: string;
}

export interface ICommandArgsOptions {
	choices?: CommandOptionChoiceResolvableType[];
	description: string;
	name: string;
	options?: ICommandArgsOptions[];
	required?: boolean;
	type: CommandOptionDataTypeResolvable;
}
