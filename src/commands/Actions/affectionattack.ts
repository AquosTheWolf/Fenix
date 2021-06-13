import { Message, MessageEmbed } from "discord.js";
import { Command } from "nukejs";
import { usernameResolver } from "../../utils/resolvers/usernameResolver";

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: "affectionAttack",
            category: "Actions",
            runIn: ["text"],
            aliases: [],
            cooldown: 5000,
            description: `Attack someone with Affection!`,
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
        if (!args[0])
            throw new Error("Who would you like to attack with affection?~");
        const target = usernameResolver(message, args[0]);
        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`Affection Attack!`)
            .setDescription(
                `${message.author} has attacked ${target} with affection!`
            );
        message.channel.send(embed);
    }
};
