import './lib/utils/augments';

import { Collection } from 'discord.js';

import { token } from '../config.json';
import { FenixClient } from './lib/fenixClient';
import { logger } from './lib/utils/logger';
import { walkDir } from './lib/utils/utils';

const commandCooldowns: Collection<string, Collection<string, number>> = new Collection();
let isBotReady = false;

const client = new FenixClient({
	intents: ['GUILDS'],
	ws: {
		compress: true,
	},
});

client.on('ready', async () => {
	logger.info('Loading Commands...');

	try {
		const files = await walkDir(`${__dirname}/commands`);

		files.forEach((file) => {
			if (file.endsWith('js')) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const fileCommand = require(file);

				const command = new fileCommand['default'](client, file);

				client.commands.set(command.options.name, command);

				logger.debug(`Loaded command ${command.options.name}`);
			}
		});

		logger.info(`Finished loading commands! Found ${client.commands.size} commands.`);
	} catch (err) {
		logger.crit(`An error has occurred while attempting to load command files! Please see error below\n${(err as Error).message}`);
	}

	logger.info('Bot is ready!');

	isBotReady = true;
});

// TODO: Implement message commands
// client.on('message', async (msg) => {
// 	if (!isBotReady) return;

// 	if (msg.author.bot) return;
// 	if (!msg.content.startsWith(config.get('prefix'))) return;

// 	const args = msg.content.slice((config.get('prefix') as string).length).trim().split(/ +/);
// 	const command = args.shift()!.toLowerCase();

// 	const findCommand = client.commands.find((com) => com.options.name === command);

// 	if (!findCommand) return;

// 	msg.channel.startTyping();

// 	if (findCommand.options.ownerOnly && msg.author.id !== config.get('owner')) {
// 		await msg.reply(i18next.t('commands:errors.ownerOnly'));
// 		msg.channel.stopTyping();
// 		return;
// 	}

// 	if ((findCommand.options.runIn === ECommandRunIn.DM) && msg.channel.type !== 'dm') {
// 		await msg.reply(i18next.t('commands:errors.dmsOnly'));
// 		msg.channel.stopTyping();
// 		return;
// 	}

// 	if ((findCommand.options.runIn === ECommandRunIn.Server) && msg.channel.type !== 'text') {
// 		await msg.reply(i18next.t('commands:errors.serverOnly'));
// 		msg.channel.stopTyping();
// 		return;
// 	}

// 	if (msg.author.id !== config.get('owner')) {
// 		if (!commandCooldowns.has(findCommand.options.name!)) {
// 			commandCooldowns.set(findCommand.options.name!, new Collection());
// 		}

// 		const now = Date.now();
// 		const timestamps = commandCooldowns.get(findCommand.options.name!);
// 		const cooldownAmount = findCommand.options.cooldown! * 1000;

// 		if (timestamps!.has(msg.author.id)) {
// 			const expirationTime = timestamps!.get(msg.author.id)! + cooldownAmount;

// 			if (now < expirationTime) {
// 				const timeLeft = (expirationTime - now) / 1000;

// 				await msg.reply(i18next.t('commands:errors.cooldownError', {
// 					time: timeLeft.toFixed(1),
// 					command: findCommand.options.name,
// 				}));
// 				msg.channel.stopTyping();
// 				return;
// 			}
// 		}

// 		timestamps!.set(msg.author.id, now);
// 		setTimeout(() => timestamps!.delete(msg.author.id), cooldownAmount);
// 	}

// 	try {
// 		info(`Command ${findCommand.options.name} is being ran in ${msg.guild ? msg.guild.name : 'DMs'} by ${msg.author.username}`, ELoggingScope.Command);
// 		await findCommand.run(msg, ...args);
// 		info(`Finished running ${findCommand.options.name} in ${msg.guild ? msg.guild.name : `${msg.author.username} DMs`}`, ELoggingScope.Command);
// 		msg.channel.stopTyping();
// 	} catch (e) {
// 		error(`An error has occurred while running ${findCommand.options.name}!\n${e.message}`, ELoggingScope.Command);
// 		await msg.reply(i18next.t('commands:errors.runError', { error: e.message }));
// 		msg.channel.stopTyping();
// 	}
// });

client.login(token);
