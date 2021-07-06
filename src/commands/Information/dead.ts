import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';

import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'dead',
            category: 'Information',
            runIn: ['text'],
            aliases: [],
            cooldown: 10000,
            description: `Send the dead chat message`,
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
        await message.delete();

        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle('Chat!')
            .setDescription(
                'Always pointing out that a chat is dead doesn\'t get you a reward or anything. In fact it doesn\'t help the server in any way. So instead of saying how inactive a channel is, try to get things moving again! Anything is better than complaining about it :3'
            )
            .setTimestamp()
            .setColor(settings.primaryColor)
            .setFooter('Credits to https://dead-ch.at/');

        await message.channel.send(embed);
    }
};
