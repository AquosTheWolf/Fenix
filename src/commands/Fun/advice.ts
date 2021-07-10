import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { Command } from 'nukejs';
import settings from './../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'advice',
            category: 'Fun',
            runIn: ['text'],
            aliases: [],
            botPerms: ['EMBED_LINKS', 'SEND_MESSAGES'],
            description: 'Ask for advices from the bot',
            enabled: true,
            usage: ''
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        message.delete().catch(() => {
        });
        const quoteJSON = await fetch('https://api.adviceslip.com/advice', {
            method: 'GET'
        }).then((res) => res.json());
        const quote = quoteJSON.slip.advice;
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('📖 Advice')
            .setDescription(quote)
            .setTimestamp()
            .setColor(settings.primaryColor)
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
