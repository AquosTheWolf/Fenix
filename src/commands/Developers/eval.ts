// This command is adapted from https://github.com/VulpoTheDev/Hozol
import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import beautify from 'beautify';
import settings from '../../settings';
import { generateHastebin } from '../../utils/general/hasteful';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'eval',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['evaluate', 'e'],
            restricted: 'dev',
            description: 'Evaluate JS Code, Be careful with it!',
            enabled: true,
        });
    }

    async run(message: Message, args: string[], client) {
        await message.delete();
        if (!args[0]) throw new Error('Please Provide JS Code you would like to Evaluate');

        const script = args.join(' ');
        if (script.includes('token')) throw new Error('Sorry, viewing the token is off limits')

        try {
            const evaluated = eval(script);
            const evaled = require('util').inspect(evaluated, { depth: 5 });
            const promisedEval: any = await Promise.resolve(evaluated);
            let res = evaled.toString().length >= 1024 ? await generateHastebin(evaled) : evaled;
            let promisedResult = promisedEval.toString().length >= 1024 ? await generateHastebin(promisedEval) : promisedEval

            // Process the output
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`)
                .setTitle('Evaluate')
                .setColor(settings.primaryColor)
                .setTimestamp()
                .addField(':inbox_tray: Input: ', `\`\`\`ts\n${beautify(script, { format: 'js' })} \`\`\``)

                .addField(':outbox_tray: Output', `\`\`\`ts\n${res}\`\`\``)

                .setFooter(`User ID: ${message.author.id}`)
                .setThumbnail(client.user?.displayAvatarURL({ dynamic: true }));

            // If what is provided a promise then, provide the resolved promise (or link) in the embed
            if (evaluated && evaluated.then) {
                embed.addField(':outbox_tray: Promise Output', `\`\`\`js\n${promisedResult}\`\`\``);
            }

            // Add a type of what is the type of what's evaluated
            embed.addField('Type of: ', `\`\`\`${typeof evaluated}\`\`\``);

            // Sends the embed
            await message.channel.send(embed);
        } catch (err) {
            // If any errors occurred... then, send the error instead
            throw new Error(err);
        }
    }
};