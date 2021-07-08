import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import fetch from 'node-fetch';
import settings from './../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'advice',
            category: 'Fun',
            runIn: ['text'],
            aliases: [],
            botPerms: ['EMBED_LINKS', 'SEND_MESSAGES'],
            description: 'Ask for advices from the bot',
            enabled: true,
            usage: '',
        });
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {HozolClient} client
     */
    async run(message: Message, args: string[], client: FurClient) {
        message.delete().catch(() => {});
        const quoteJSON = await fetch('https://api.adviceslip.com/advice', {
            method: 'GET',
        }).then((res) => res.json());
        const quote = quoteJSON.slip.advice;
        const embed = new MessageEmbed()
            .setTitle('📖 Advice')
            .setDescription(quote)
            .setTimestamp()
            .setColor(settings.primaryColor)
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
