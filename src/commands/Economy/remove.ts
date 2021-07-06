import { Message } from 'discord.js';
import { Command } from 'nukejs';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'remove',
            category: 'Economy',
            runIn: ['text'],
            aliases: [],
            cooldown: 5,
            description: `Remove money from someone`,
            enabled: true,
            ignoredInhibitors: []
        });
    }

    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: FurClient) {
        // TODO: Work on this
    }
};
