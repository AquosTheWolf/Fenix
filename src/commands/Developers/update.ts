// This command is adapted from https://github.com/VulpoTheDev/Hozol
import { execSync as exec } from 'child_process';
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import settings from '../../settings';
import { generateHastebin } from '../../utils/general/hasteful';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'update',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['upgrade'],
            botPerms: ['EMBED_LINKS'],
            restricted: 'dev',
            description: 'Updates Fenix!',
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
            .setTitle('📥  Update - Updating bot...')
            .setColor(settings.primaryColor)
            .setDescription('⏲️ This may take a bit...')
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);

        // Makes what is sent a message variable
        const msg = await message.channel.send(embed);

        try {
            await exec('git stash').toString();
            let gitPull = await exec('git pull origin master').toString();
            let npmInstall = await exec('yarn').toString();
            if(gitPull.length > 1024 || npmInstall.length > 1024) {
                npmInstall = await generateHastebin(npmInstall) as string;
                gitPull = await generateHastebin(gitPull) as string;
            }

            const complete = new MessageEmbed()
                .setAuthor(
                    `${message.author.tag}`,
                    `${message.author.displayAvatarURL({ dynamic: true })}`
                )
                .setColor(settings.primaryColor)
                .setTitle('Update - Bot was updated!')
                .addField(`📥 Git Pull`, `\`\`\`${gitPull}\`\`\``)
                .addField(`🧶 Yarn Install`, `\`\`\`${npmInstall}\`\`\``)
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            await msg.edit(complete);
        } catch(e) {
            const error = new MessageEmbed()
                .setAuthor(
                    `${message.author.tag}`,
                    `${message.author.displayAvatarURL({ dynamic: true })}`
                )
                .setColor(settings.primaryColor)
                .setTitle('ERROR! - Bot didn\'t update!')
                .setDescription(
                    `Please pray the lords and hope that the update didn't mess up the prod files.(Please ssh into the server and resolve the errors) \n \`\`\`${e}\`\`\``
                )
                .setTimestamp()
                .setFooter(`User ID: ${message.author.id}`);
            return message.channel.send(error);
        }
    }
};
