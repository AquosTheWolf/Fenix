import Command from '../lib/structures/command';

import type { Client, CommandInteraction } from 'discord.js';

export default class extends Command {
	public constructor(client: Client, file: string) {
		super(client, file, {
			name: 'test1',
			shortDescription: 'test owo',
		});
	}

	public run(interaction: CommandInteraction): void | Promise<void> {
		interaction.reply('Hi owo');
	}
}
