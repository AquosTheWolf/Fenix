// Made by Nepgfurmixpro#1717 to output the console log for easy dev purposes
import { Message } from 'discord.js';
import { Command } from 'nukejs';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'getlogs',
            category: 'Developers',
            runIn: ['text'],
            aliases: ['glogs'],
            botPerms: ['EMBED_LINKS'],
            restricted: 'dev',
            description: 'Output the console log!',
            enabled: true
        });
    }

    async run(message: Message, args: string[], client) {
        await message.delete();

        var str = '';
        for(let log in console.logs) {
            str += console.logs[log];
        }
        var messagesToPrint = str.match(/.{1,1994}/g);
        var messages = '';
        for(let index in messagesToPrint) {
            messages += `\`${messagesToPrint[index]}\`\n`;
        }
        await message.channel.send(messages);
    }
};
