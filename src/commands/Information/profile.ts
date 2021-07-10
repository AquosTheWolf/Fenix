import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';

import settings from '../../settings';
import { usernameResolver } from '../../utils/resolvers/usernameResolver';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'profile',
            category: 'Information',
            runIn: ['text'],
            aliases: [],
            cooldown: 10000,
            description: `Display your (or a specified members) coins, reputation, level and more`,
            enabled: true,
            ignoredInhibitors: []
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        const target = args[0] ? await message.guild.members.cache.get((await usernameResolver(message, args[0])).id) : message.member;
        const profile = await target.settings();
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('Profile')
            .addField(`Coins`, profile.coins, true)
            .addField(`Reps`, profile.reps, true)
            .addField(`XP`, profile.xp, true)
            .setColor(settings.primaryColor)
            .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);

        await message.channel.send(embed);
    }
};
