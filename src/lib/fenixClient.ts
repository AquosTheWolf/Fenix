import { Client, ClientOptions, Collection } from 'discord.js';

import type Command from './structures/command';

export class FenixClient extends Client {
	public commands: Collection<string, Command>;

	public constructor(options: ClientOptions) {
		super(options);

		this.commands = new Collection<string, Command>();
	}
}
