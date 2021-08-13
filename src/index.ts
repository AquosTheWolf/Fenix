/* eslint-disable @typescript-eslint/ban-ts-comment */
import './lib/utils/augments';

import { REST } from '@discordjs/rest';
import { APIApplicationCommand, Routes } from 'discord-api-types/v9';
import { ApplicationCommand, ApplicationCommandOptionData, ChatInputApplicationCommandData, Collection } from 'discord.js';
import _ from 'lodash';

import { owner, token } from '../config.json';
import { FenixClient } from './lib/fenixClient';
import { logger } from './lib/utils/logger';
import { walkDir } from './lib/utils/utils';

import type Command from './lib/structures/command';

const commandCooldowns: Collection<string, Collection<string, number>> = new Collection();
const slashCommands: Collection<string, ApplicationCommand> = new Collection();
let isBotReady = false;

const client = new FenixClient({
	intents: ['GUILDS'],
	ws: {
		compress: true,
	},
});

client.once('ready', async () => {
	logger.info('Getting commands from Discord API...');

	const getCommands = await new REST({ version: '9' }).setToken(token).get(Routes.applicationCommands(client.application!.id)) as APIApplicationCommand[];
	getCommands.forEach((val) => {
		const application = new ApplicationCommand(client, val);

		slashCommands.set(application.id, application);
	});

	logger.info('Loading Commands...');

	try {
		const files = await walkDir(`${__dirname}/commands`);

		files.forEach(async (file) => {
			if (file.endsWith('js')) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const fileCommand = require(file);
				const command: Command = new fileCommand['default'](client, file);
				client.commands.set(command.options.name!, command);

				if (!slashCommands.find((int) => int.name === command.options.name)) {
					logger.debug(`Creating new command ${command.options.name}`);

					const commandOptions: ApplicationCommandOptionData[] = [];

					command.options.args?.forEach((arg) => {
						commandOptions.push({
							name: arg.name,
							description: arg.description,
							type: arg.type,
							choices: arg.choices,
							required: arg.required,
							// @ts-ignore
							options: arg.options,
						});
					});

					client.application?.commands.create({
						name: command.options.name!,
						description: command.options.shortDescription!,
						options: commandOptions,
					});
				} else {
					const commandOptions: ApplicationCommandOptionData[] = [];

					command.options.args?.forEach((arg) => {
						commandOptions.push({
							name: arg.name,
							description: arg.description,
							type: arg.type,
							choices: arg.choices,
							required: arg.required,
							// @ts-ignore
							options: arg.options,
						});
					});

					const fileCommand: ChatInputApplicationCommandData = {
						name: command.options.name!,
						description: command.options.shortDescription!,
						options: commandOptions,
					};

					const cacheCommand1 = slashCommands.find((cmd) => cmd.name === fileCommand.name)?.toJSON() as ChatInputApplicationCommandData;
					const cacheCommand2 = { name: cacheCommand1.name, description: cacheCommand1.description, options: cacheCommand1.options };

					if (!_.isEqual(fileCommand, cacheCommand2)) {
						logger.debug(`Editing command ${fileCommand.name}`);

						client.application?.commands.edit(slashCommands.find((int) => int.name === command.options.name)!, fileCommand);
					}
				}

				logger.debug(`Loaded command ${command.options.name}`);
			}
		});

		slashCommands.forEach((command) => {
			if (!client.commands.find((cmd) => command.name === cmd.options.name)) {
				client.application?.commands.delete(command.id);

				logger.debug(`Deleting non-existent command ${command.name}`);
			}
		});

		logger.info(`Finished loading commands! Found ${client.commands.size} commands.`);
	} catch (err) {
		logger.error(`An error has occurred while attempting to load command files! Please see error below\n${(err as Error).message}`);
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
		logger.error(`An error has occurred while running ${findCommand.options.name}!\n${(e as Error).message}`);

		await interaction.reply(`An error has ocurred while running this command. Please pass this error on to the bot developers\n${(e as Error).message}`);
	}
});

client.login(token);
