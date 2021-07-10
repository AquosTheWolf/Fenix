import { Message, MessageEmbed } from 'discord.js';
import { search } from 'node-ddg';
import { Command } from 'nukejs';
import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'search',
            category: 'Fun',
            runIn: ['text'],
            aliases: [],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Search with a given term',
            enabled: true,
            usage: ''
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        if(args[0]) {
            const embed = new MessageEmbed()
                .setAuthor(
                    `${message.author.tag}`,
                    `${message.author.displayAvatarURL({ dynamic: true })}`
                )
                .setTitle('Search Command')
                .setColor(settings.primaryColor)
                .setDescription(`Searching for ${args.slice(0)}`)
                .setFooter(`User ID: ${message.author.id}`)
                .setTimestamp();
            let msg = await message.channel.send(embed);
            await search({ query: args.join('+'), maxResults: 5 }).then((results) => {
                results.forEach(result => {
                    embed.addField(`[${result.title}](${result.url})`, `${result.body}`);
                });
            }).catch((err) => console.error(err));
            embed.setDescription(' ');
            await msg.edit(embed);
        } else {
            throw new Error('You gotta give me something to search.');
        }
    }
};
