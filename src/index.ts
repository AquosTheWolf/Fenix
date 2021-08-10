import { Client } from 'discord.js';

import { token } from '../config.json';
import { logger } from './lib/utils/logger';

const client = new Client({
	intents: ['GUILDS'],
	ws: {
		compress: true,
	},
});

client.on('ready', () => {
	logger.info('Ready!');
});

client.login(token);
