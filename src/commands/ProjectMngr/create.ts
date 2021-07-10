import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';

import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'create',
            category: 'Community Projects',
            runIn: ['text'],
            aliases: [],
            cooldown: 500,
            description: `Create a Community Project Channel`,
            enabled: true,
            ignoredInhibitors: []
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        const guildSettings = await message.guild.settings();
        const memberSettings = await message.member.settings();
        if(
            !guildSettings.communityProjectsCategory &&
            !guildSettings.communityRequiredRole
        )
            throw new Error(
                'The Community Project Category **and/or** the community projects required role is not setup, please ping a Staff Member to set it up'
            );
        if(
            !message.member.roles.cache.get(guildSettings.communityRequiredRole)
        )
            throw new Error(
                'You don\'t have the required role in order to make community projects, maybe to earn the role by being active and/or picking roles if you haven\'t if you feel like you\'ve been active and you have roles go ahead and nudge a Staff Member to give you one'
            );
        if(
            memberSettings.communityChannelCounts >=
            guildSettings.communityProjectsLimit
        )
            throw new Error(
                'You have too many Community Channels, please remove one to make a new one'
            );
        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
                `Welcome ${
                    message.author.username
                } to the Community Projects Creation Wizard. ${
                    memberSettings.communityChannelCounts > 0
                        ? ` Since this is the first community channel you're making lets go over how this wizard works, Firstly I'll ask you questions related to your projects, then you'll answer the questions asked. This embed will update asking a new question once the previous question is answered. Once this wizard process is completed it'll be sent to the staff members for approval, once approved you'll receive a message saying your project has been approved and you're able to manage it`
                        : `Once this wizard process is completed it'll be sent to the staff members for approval, once approved you'll receive a message saying your project has been approved and you're able to manage it`
                }`
            )
            .setColor(settings.primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        const msg = await message.channel.send(embed);
        await msg.react('👍');
        await msg.react('❌');

        const filter = (reaction, user) => {
            return (
                ((reaction.emoji.name === '👍' ||
                    reaction.emoji.name === '❌') && user.id === message.author.id)
            );
        };

        msg.awaitReactions(filter, {
            time: 60000,
            errors: ['time']
        }).then((collected) => {
            console.log(collected);
            switch(collected.first().emoji.name) {
                case '👍':
                    const messageListening = msg.channel.createMessageCollector(
                        (m: Message) => m.author.id === message.author.id
                    );
                    break;
                case '❌':
                    msg.delete();
                    break;
            }
        });
    }
};
