import _ from 'lodash';
import path from 'path';

import type { Client, Message } from 'discord.js';

import type { ICommandOptions } from '../utils/types';

export default abstract class Command {
	public readonly client: Client;
	public readonly file: string;
	public readonly options: ICommandOptions;

	protected constructor(client: Client, file: string, options?: ICommandOptions) {
		this.client = client;
		this.file = file;

		const defaultOptions: ICommandOptions = {
			cooldown: 5,
			group: path.basename(path.dirname(this.file)) === 'commands' ? '' : path.basename(path.dirname(this.file)),
			name: path.basename(this.file, path.extname(this.file)),
			registerAsSlashCommand: true,
			shortDescription: '',
		};

		this.options = _.merge(defaultOptions, options);
	}

	public abstract run(message: Message, ...args: string[]): Promise<void> | void;
}
