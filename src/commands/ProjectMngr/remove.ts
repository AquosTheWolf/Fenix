import {
    CategoryChannel,
    GuildChannel,
    MessageReaction,
    TextChannel,
    User,
} from "discord.js";
import { Message, MessageEmbed } from "discord.js";
import moment from "moment";
import { Command } from "nukejs";
import { Member } from "../../database/models/MembersConfig";

import settings from "../../settings";

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: "remove",
            category: "Community Projects",
            runIn: ["text"],
            aliases: [],
            cooldown: 500,
            description: `Remove a Community Project Channel`,
            enabled: true,
            ignoredInhibitors: [],
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        if (!message.guild) return;
        const guildSettings = await message.guild.settings();
        const memberSettings = await message.member.settings();
        const membersProjects = memberSettings.communityChannels;
        console.log(membersProjects);
        // 863582538056597604
        if (
            message.guild.channels.cache.get(message.channel.id).parentID !==
            guildSettings.communityProjectsCategory
        ) {
            throw new Error(
                "You can only delete channels **that are inside the community projects category**"
            );
        }
        if (guildSettings.staffMembers.includes(message.author.id)) {
            let data = "";
            message.channel.messages.fetch().then((messages) => {
                messages.forEach((msg) => {
                    data += `+++Message by ${msg.author.username}#${
                        msg.author.discriminator
                    } (${msg.author.id}), ID ${message.id}, channel ${
                        (message.channel as GuildChannel).name
                    }+++\n`;
                    data += `-Time: ${moment(msg.createdAt).format()}\n`;
                    msg.attachments.array().map((attachment) => {
                        data += `-Attachment: ${attachment.url}\n`;
                    });
                    msg.embeds.forEach((embed) => {
                        data += `-Embed: ${JSON.stringify(embed)}\n`;
                    });
                    data += `${msg.cleanContent}\n\n\n`;
                });
            });
            const buffer = Buffer.from(data, "utf-8");

            // Embed
            const author = await Member.findOne({
                communityChannels: { $in: [message.channel.id] },
            });
            console.log(author.userID);
            const display = new MessageEmbed()
                .setTitle(
                    "Your Community Channel has been removed by a staff member!"
                )
                .setDescription("Heya")
                .setColor(settings.primaryColor)
                .setTimestamp();
            message.author.send(display, {
                files: [
                    {
                        attachment: buffer,
                        name: `bulkDelete_${moment().valueOf()}.txt`,
                    },
                ],
            });
        } else if (membersProjects.includes(message.channel.id)) {
            let data = "";
            message.channel.messages.fetch().then((messages) => {
                messages.forEach((msg) => {
                    data += `+++Message by ${msg.author.username}#${
                        msg.author.discriminator
                    } (${msg.author.id}), ID ${message.id}, channel ${
                        (message.channel as GuildChannel).name
                    }+++\n`;
                    data += `-Time: ${moment(msg.createdAt).format()}\n`;
                    msg.attachments.array().map((attachment) => {
                        data += `-Attachment: ${attachment.url}\n`;
                    });
                    msg.embeds.forEach((embed) => {
                        data += `-Embed: ${JSON.stringify(embed)}\n`;
                    });
                    data += `${msg.cleanContent}\n\n\n`;
                });
            });
            const buffer = Buffer.from(data, "utf-8");

            const display = new MessageEmbed()
                .setTitle(
                    "Your Community Channel has been removed by a staff member!"
                )
                .setDescription("Heya")
                .setColor(settings.primaryColor)
                .setTimestamp();
            message.author.send(display, {
                files: [
                    {
                        attachment: buffer,
                        name: `bulkDelete_${moment().valueOf()}.txt`,
                    },
                ],
            });
        } else {
            throw new Error(
                "Heya, you cannot delete someone elses community channel. If theres an issue with this channel... please contact staff"
            );
        }
    }
};
