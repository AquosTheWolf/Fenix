import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import settings from '../../settings';

export default class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'balance',
            category: 'Economy',
            runIn: ['text'],
            aliases: ['bal'],
            cooldown: 5,
            description: `View your or another's balance`,
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
        const target =
            message.guild.members.cache.get(args[0]) ||
            message.mentions.members.first() ||
            message.member;
        const targetSettings = await target.settings();
        const embed = new MessageEmbed()
            .setTitle('Balance')
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .addField('Bank Balance', `${targetSettings.bankCoins} ${settings.currency}`)
            .addField('Wallet', `${targetSettings.coins} ${settings.currency}`)
            .setTimestamp()
            .setColor(settings.primaryColor)
            .setFooter(`User ID: ${message.author.id}`);
        await message.channel.send(embed);
    }
};
