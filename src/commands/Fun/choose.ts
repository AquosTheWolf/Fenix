import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'choose',
            category: 'Fun',
            runIn: ['text'],
            aliases: ['pick'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Make the bot decide on your choices',
            enabled: true,
            usage: 'option 1 or option 2 or [...]'
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        message.delete().then(() => {
        });
        if(!args)
            throw new Error(
                'You must provide choices seperated with an " or "'
            );
        const options = args.slice(0).join(' ').split(' or ');
        if(options.length <= 1)
            throw new Error(
                'You must provide more than 1 options seperated with an " or "'
            );
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('🧐 Choices')
            .setDescription(
                `Out of the ${options.length} choices, I choose ${
                    options[Math.floor(Math.random() * options.length)]
                }`
            )
            .setColor(settings.primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
