import { Message, MessageEmbed } from "discord.js";
import { Command } from "nukejs";
import botSettings from "../../settings";
import { usernameResolver } from "../../utils/resolvers/usernameResolver";

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: "add",
            category: "Economy",
            runIn: ["text"],
            aliases: ["addmoney"],
            cooldown: 0,
            description: `Add money to a member`,
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
        const settings = await message.guild.settings();
        if (!settings.bankerRole)
            throw new Error(
                "You must setup a Bank role in order to use this command"
            );
        if (!message.member.roles.cache.has(settings.bankerRole))
            throw new Error(
                "You must have the **bank role** in order to be able to add money to a member"
            );
        if (!args[0])
            throw new Error(
                "You didn't specify a member that you would like to add money to, you can specify by mentioning that user, or providing it's nickname, name or user id"
            );
        const member = message.guild.members.cache.get(
            (await usernameResolver(message, args[0])).id
        );
        const amount: number = args[1] as unknown as number;
        if (!amount || amount <= 0 || isNaN(amount))
            throw new Error(
                "Please specify an amount of money you would want to give to the user that's also greater than 0"
            );
        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setColor(botSettings.primaryColor)
            .addField(
                "Old Balance",
                `${(await member.settings()).coins - amount} ${botSettings.currency}`
            )
            .addField("Money Added", `${amount} ${botSettings.currency}`)
            .addField("New Balance", `${(await member.settings()).coins} ${botSettings.currency}`)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
