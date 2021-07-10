import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { Command } from 'nukejs';
import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'cat',
            category: 'Fun',
            runIn: ['text'],
            aliases: ['meow'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Send a Random cat',
            enabled: true,
            usage: ''
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        message.delete().catch(() => {
        });
        try {
            const catImageJSON = await fetch(
                'https://aws.random.cat/meow'
            ).then((res) => res.json());
            const catImageURL = catImageJSON.file;
            const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('🐱 Random Cat!')
                .setImage(catImageURL)
                .setColor(settings.primaryColor)
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            await message.channel.send(embed);
        } catch(e) {
            throw new Error(
                'There was an issue getting a random cat image... sorry'
            );
        }
    }
};
