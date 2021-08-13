import fs from 'fs';
import path from 'path';
import process from 'process';

import Command from '../../lib/structures/command';

import type { Client, CommandInteraction } from 'discord.js';

export default class extends Command {
	public constructor(client: Client, file: string) {
		super(client, file, {
			args: [
				{
					name: 'lines',
					description: 'The number of lines to get starting from the back',
					type: 'INTEGER',
					required: false,
				},
			],
			shortDescription: 'Gets the logs of the bot',
			ownerOnly: true,
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const getLogFile = await this._getLatestLogFile();

		fs.readFile(path.join(process.cwd(), 'logs', getLogFile), { encoding: 'utf8' }, async (err, data) => {
			if (err) throw err;

			// eslint-disable-next-line no-control-regex
			const noAnsiData = data.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

			await interaction.reply({ content: `\`\`\`${noAnsiData.split('\n').slice(-(interaction.options.getInteger('lines', false) ?? 10)).join('\n')}\`\`\``, ephemeral: true });
		});
	}

	private async _getLatestLogFile(): Promise<string> {
		return new Promise((res, rej) => {
			let checkFileModDate: number;

			fs.readdir(path.join(process.cwd(), 'logs'), (err, files) => {
				if (err) rej(err);

				const logFiles = files.filter((val) => !val.startsWith('exceptions')).filter((val) => val.endsWith('.log'));

				logFiles.forEach((file, index) => {
					fs.stat(path.join(process.cwd(), 'logs', file), (err, stats) => {
						if (err) rej(err);

						if (!checkFileModDate) checkFileModDate = stats.mtime.getTime();
						else if (checkFileModDate <= stats.mtime.getTime()) checkFileModDate = stats.mtime.getTime();
						else checkFileModDate = stats.mtime.getTime();
					});

					if (index === logFiles.length - 1) res(file);
				});
			});
		});
	}
}
