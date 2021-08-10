import type { Collection } from 'discord.js';

import type Command from '../structures/command';

declare module 'discord.js' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Client {
		commands: Collection<string, Command>;
	}
}
