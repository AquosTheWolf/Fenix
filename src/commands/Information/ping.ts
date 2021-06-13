import { Message, MessageEmbed } from "discord.js";
import { Command } from "nukejs";
import settings from "../../settings";

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: "ping",
            category: "Information",
            runIn: ["text"],
            aliases: [],
            cooldown: 0,
            description: `Ping the Bot`,
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
        message.delete();
        const msg = await message.channel.send("Flying...");
        const embed = new MessageEmbed()
            .setTitle("Ping")
            .addField("ws/API Latency", `${Math.round(client.ws.ping)}ms`)
            .addField(
                "Message Latency is",
                `${Date.now() - msg.createdTimestamp}ms`
            )
            .setColor(settings.primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        message.channel.send(embed);
    }
};
