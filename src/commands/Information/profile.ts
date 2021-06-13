import { Message, MessageEmbed } from "discord.js";
import { Command } from "nukejs";
import settings from "../../settings";
import { usernameResolver } from "../../utils/resolvers/usernameResolver";

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: "profile",
            category: "Information",
            runIn: ["text"],
            aliases: [],
            cooldown: 10000,
            description: `Display your (or a specified members) coins, reputation, level and more`,
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
        message.delete()
        const target = await message.guild.members.cache.get((await usernameResolver(message, args[0])).id) || message.member
        const profile = await target.settings()
        const embed = new MessageEmbed()
        .setAuthor(message.author.id, message.author.displayAvatarURL({ dynamic: true }))
        .setTitle('Profile')
        .addField(`Coins`, profile.coins)
        .addField(`Reps`, profile.reps)
        .addField(`XP`, profile.xp)
        .setColor(settings.primaryColor)
        .setTimestamp()
        .setFooter(`User ID: ${message.author.id}`)

    }
};
