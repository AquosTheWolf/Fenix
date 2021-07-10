import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { Command } from 'nukejs';
import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'duck',
            category: 'Fun',
            runIn: ['text'],
            aliases: ['quack'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Send a random duck image',
            enabled: true,
            usage: ''
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        const { url } = await fetch('https://random-d.uk/api/v2/random').then((response) => response.json());
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle('🦆 Quack Quack!')
            .setImage(url)
            .setColor(settings.primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
