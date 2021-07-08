import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import fetch from 'node-fetch';
import settings from '../../settings';
module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'cat',
            category: 'Fun',
            runIn: ['text'],
            aliases: ['meow'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Send a Random cat',
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
        try {
            const catImageJSON = await fetch(
                'https://aws.random.cat/meow'
            ).then((res) => res.json());
            const catImageURL = catImageJSON.file;
            const embed = new MessageEmbed()
                .setTitle('Random Cat!')
                .setDescription('Meow')
                .setImage(catImageURL)
                .setColor(settings.primaryColor)
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            message.channel.send(embed);
        } catch (e) {
            throw new Error(
                'There was an issue getting a random cat image... sorry'
            );
        }
    }
};
