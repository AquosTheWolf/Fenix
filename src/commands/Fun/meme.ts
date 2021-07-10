import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import randomPuppy from 'random-puppy';
import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'meme',
            category: 'Fun',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Send a random meme from a random subreddit',
            enabled: true,
            usage: ''
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        const subReddits = [`dankmeme`, `meme`, `me_irl`];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const img = await randomPuppy(random);
        const embed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
            .setTitle('Meme to Light up your day!')
            .setImage(img)
            .setColor(settings.primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
