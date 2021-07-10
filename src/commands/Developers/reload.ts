// This command is adapted from https://github.com/VulpoTheDev/Hozol
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'reload',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['restart'],
            botPerms: ['EMBED_LINKS'],
            restricted: 'dev',
            description: 'Restarts Fenix!',
            enabled: true
        });
    }

    async run(message: Message, args: string[], client) {
        // Deletes the sent message
        await message.delete();

        // Sends an embed showing the it's updating the bot
        const embed = new MessageEmbed()
            .setAuthor(
                `${message.author.tag}`,
                `${message.author.displayAvatarURL({ dynamic: true })}`
            )
            .setTitle('⚠️ Reloading the Bot.')
            .setColor(settings.primaryColor)
            .setDescription('⏲️ This may take a bit.')
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed).then(async (msg) => {
            try {
                // Executes this command then reload the commands
                await process.exit();
                embed.setTitle('The bot has been reloaded.');
                embed.setDescription('The bot\'s commands has been reloaded!');
                await msg.edit(embed);
            } catch(err) {
                // ERROR!? Throw it
                throw new Error(err);
            }
        });
    }
};
