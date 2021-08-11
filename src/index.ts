import './lib/utils/augments';

import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { APIApplicationCommand, Routes } from 'discord-api-types/v9';
import { ApplicationCommand, ApplicationCommandOptionData, Collection } from 'discord.js';

import { owner, token } from '../config.json';
import { FenixClient } from './lib/fenixClient';
import { logger } from './lib/utils/logger';
import { walkDir } from './lib/utils/utils';

import type Command from './lib/structures/command';

const commandCooldowns: Collection<string, Collection<string, number>> = new Collection();
let isBotReady = false;

const client = new FenixClient({
	intents: ['GUILDS'],
	ws: {
		compress: true,
	},
});

client.once('ready', async () => {
	logger.info('Loading Commands...');

	try {
		const files = await walkDir(`${__dirname}/commands`);

		files.forEach(async (file) => {
			if (file.endsWith('js')) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const fileCommand = require(file);

				const command: Command = new fileCommand['default'](client, file);

				client.commands.set(command.options.name!, command);

				const getCommands = await new REST({ version: '9' }).setToken(token).get(Routes.applicationCommands(client.application!.id)) as APIApplicationCommand[];
				getCommands.forEach((val) => {
					const application = new ApplicationCommand(client, val);

					client.application?.commands.cache.set(application.id, application);
				});

				// TODO: Delete commands for which don't exist anymore.
				// TODO: Figure out a way to edit commands when data changes.
				if (!client.application?.commands.cache.find((int) => int.name === command.options.name?.toLowerCase())) {
					const commandOptions: ApplicationCommandOptionData[] = [];

					command.options.args?.forEach((arg) => {
						commandOptions.push({
							name: arg.name,
							description: arg.description,
							type: arg.type,
							choices: arg.acceptedValues,
							required: !arg.optional,
							options: arg.options,
						});
					});

					client.application?.commands.create({
						name: command.options.name!,
						description: command.options.shortDescription!,
						options: commandOptions,
					});
				}

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

client.on('interactionCreate', async (interaction) => {
	if (!isBotReady) return;
	if (!interaction.isCommand()) return;

	const findCommand = client.commands.find((com) => com.options.name === interaction.commandName);
	if (!findCommand) return;

	if (findCommand.options.ownerOnly && interaction.user.id !== owner) {
		await interaction.reply('This command can be ran by the bot owner only!');
		return;
	}

	if ((findCommand.options.runIn === 'dms') && interaction.channel?.type !== 'DM') {
		await interaction.reply('This command can only be ran in DMs!');
		return;
	}

	if ((findCommand.options.runIn === 'servers') && interaction.channel?.type !== 'GUILD_TEXT') {
		await interaction.reply('This command can only be ran in a Server!');
		return;
	}

	if (interaction.user.id !== owner) {
		if (!commandCooldowns.has(findCommand.options.name!)) {
			commandCooldowns.set(findCommand.options.name!, new Collection());
		}

		const now = Date.now();
		const timestamps = commandCooldowns.get(findCommand.options.name!);
		const cooldownAmount = findCommand.options.cooldown! * 1000;

		if (timestamps!.has(interaction.user.id)) {
			const expirationTime = timestamps!.get(interaction.user.id)! + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;

				await interaction.reply(`Please wait ${timeLeft} before running ${findCommand.options.name} again!`);
				return;
			}
		}

		timestamps!.set(interaction.user.id, now);
		setTimeout(() => timestamps!.delete(interaction.user.id), cooldownAmount);
	}

	try {
		logger.info(`Command ${findCommand.options.name} is being ran in ${interaction.guild ? interaction.guild.name : 'DMs'} by ${interaction.user.username}`);
		await findCommand.run(interaction);
		logger.info(`Finished running ${findCommand.options.name} in ${interaction.guild ? interaction.guild.name : `${interaction.user.username} DMs`}`);
	} catch (e) {
		logger.crit(`An error has occurred while running ${findCommand.options.name}!\n${(e as Error).message}`);

		await interaction.reply(`An error has ocurred while running this command. Please pass this error on to the bot developers\n${(e as Error).message}`);
	}
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
