import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'nukejs';
import fetch from 'node-fetch';
import settings from '../../settings';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'define',
            category: 'Fun',
            runIn: ['text'],
            aliases: ['dictionary'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            description: 'Define a given word',
            enabled: true,
            usage: '',
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        if(!process.env.DICTIONARYAPI) throw new Error('Missing Dictionary API Key, Command is unable to be used')
        if(args[0]){
            let definitionNumber = 0
            let word = args.join(" ")

            let data = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.DICTIONARYAPI}`).then(res => res.json()).catch(err => {
                throw new Error("Error Processing the Word... It's probably Dictionary API being weird.... Try Again Later!")
            })
            let embed = new MessageEmbed()
                .setAuthor(
                    `${message.author.tag}`,
                    `${message.author.displayAvatarURL({dynamic: true})}`
                )
                .setTitle(`Definition of ${word}`)
                .setColor(settings.primaryColor)
                .setFooter(`User ID: ${message.author.id}`)
                .setTimestamp();
            try{

                data[0].shortdef.forEach(defin => {
                    definitionNumber++
                    embed.addField(`Definition ${definitionNumber}`, `${defin}`)
                })
            }catch(err){
                throw new Error("Error Processing the word... Are you sure that word exist in the dictionary?")
            }
            message.channel.send(embed)
        }else{
            throw new Error("Give me something I can define for you!")
        }
    }
};
