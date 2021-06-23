import { Message } from 'discord.js';
import { Command } from 'nukejs';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'pay',
            category: 'Economy',
            runIn: ['text'],
            aliases: [],
            cooldown: 5,
            description: `Pay someone`,
            enabled: true,
            ignoredInhibitors: [],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: FurClient) {
        // TODO: WORK ON THIS
    }
};