import { Message, MessageEmbed } from "discord.js";
import { Command } from "nukejs";
import settings from "../../settings";

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: "bank",
            category: "Economy",
            runIn: ["text"],
            aliases: [],
            cooldown: 5,
            description: `Manage your money from the bank `,
            enabled: true,
            ignoredInhibitors: [],
        });
    }
    /**
     * @param message
     * @param args
     * @param client
     */
    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        const embed = new MessageEmbed().setAuthor(
            message.author.tag,
            message.author.displayAvatarURL({ dynamic: true })
        )
        .setColor(settings.primaryColor)
        .setTimestamp()
        .setFooter(`User ID: ${message.author.id}`)
        if (!args[0]) {
            embed.setDescription(`Welcome to ${message.guild.name}'s Local ATM what do you want to do?`)
            .addField(`💸 Withdraw Money`, `10% Service Fee`)
            .addField(`💰 Deposit Money`, `5% Service Fee`)
            await message.channel.send(embed)
        }else{
            // TODO: Work on this
        }
    }
};
