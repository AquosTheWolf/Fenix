import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import settings from '../../settings';

module.exports = class extends Command {
    /**
     * @param {any} file
     */
    constructor(file: any) {
        super(file, {
            name: 'coinflip',
            category: 'Fun',
            runIn: ['text'],
            aliases: ['cf'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Flip a Coin',
            enabled: true,
            usage: '[bets]'
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        message.delete().then(() => {
        });
        const coin = ['Head', 'Tails'];
        const bets = coin.includes(args[0]) ? args[0] : null;
        const flip = coin[Math.floor(Math.random() * coin.length)];
        const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('🪙 Coin Flip')
            .setDescription(
                `*flips a coin* The coin says ${flip}! ${
                    bets
                        ? `You also made a bet and ${
                            bets === flip
                                ? 'You Won the bet!'
                                : 'You Lost the bet!'
                        }`
                        : ''
                }`
            )
            .setColor(settings.primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
