import { CategoryChannel, MessageReaction, User } from "discord.js";
import { Message, MessageEmbed } from "discord.js";
import { Command } from "nukejs";
import { Member } from "../../database/models/MembersConfig";

import settings from "../../settings";

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: "create",
            category: "Community Projects",
            runIn: ["text"],
            aliases: [],
            cooldown: 500,
            description: `Create a Community Project Channel`,
            enabled: true,
            ignoredInhibitors: [],
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        await message.delete();
        const guildSettings = await message.guild.settings();
        const memberSettings = await message.member.settings();
        if (
            !guildSettings.communityProjectsCategory &&
            !guildSettings.communityRequiredRole
        )
            throw new Error(
                "The Community Project Category **and/or** the community projects required role is not setup, please ping a Staff Member to set it up"
            );
        if (
            !message.member.roles.cache.get(guildSettings.communityRequiredRole)
        )
            throw new Error(
                "You don't have the required role in order to make community projects, maybe to earn the role by being active and/or picking roles if you haven't if you feel like you've been active and you have roles go ahead and nudge a Staff Member to give you one"
            );
        if (
            memberSettings.communityChannels.length >=
            guildSettings.communityProjectsLimit
        )
            throw new Error(
                "You have too many Community Channels, please remove one to make a new one"
            );
        const embed = new MessageEmbed()
            .setAuthor(
                message.author.tag,
                message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
                `Welcome ${
                    message.author.username
                } to the Community Projects Creation Wizard. ${
                    memberSettings.communityChannels.length > 0
                        ? ` Since this is the first community channel you're making lets go over how this wizard works, Firstly I'll ask you questions related to your projects, then you'll answer the questions asked. This embed will update asking a new question once the previous question is answered. Once this wizard process is completed it'll be sent to the staff members for approval, once approved you'll receive a message saying your project has been approved and you're able to manage it`
                        : `Once this wizard process is completed it'll be sent to the staff members for approval, once approved you'll receive a message saying your project has been approved and you're able to manage it`
                }`
            )
            .setColor(settings.primaryColor)
            .setTimestamp()
            .setFooter(`User ID: ${message.author.id}`);
        const msg = await message.channel.send(embed);
        await msg.react("✅");
        await msg.react("❌");
        const allowedEmojis = ["✅", "❌"];
        const filter = (r: MessageReaction, u: User) =>
            message.author.id === u.id && allowedEmojis.includes(r.emoji.name);
        const m = msg.createReactionCollector(filter, { time: 60000 * 5 });
        const rules = [
            "🔹 No NSFW projects as there is minors in this server",
            "🔹 Your may not abuse the community projects. One mistake will result in a warn up to a ban depending on the serverity since you're reading this you know not to abuse it.",
            "🔹 If your channel has no new content within 1-2 months after its last message it'll **MAY BE REMOVED** letting you know",
        ];

        m.on("collect", async (collected) => {
            switch (collected.emoji.name) {
                case "✅":
                    msg.reactions.removeAll();
                    embed.setDescription("");
                    msg.channel.send("What is your project name?");
                    msg.edit(embed);
                    const projectNameProvided = await msg.channel.awaitMessages(
                        (m) => m.author == message.author,
                        {
                            max: 1,
                            time: 1000 * 60 * 10,
                            errors: ["time"],
                        }
                    );
                    const projectName = projectNameProvided
                        .first()
                        ?.content.toLowerCase()
                        .replaceAll(" ", "-");
                    embed.addField("Project Name", projectName);
                    msg.channel.send(
                        "Give a breif description about your project"
                    );
                    msg.edit(embed);
                    const projectDescriptionProvided =
                        await msg.channel.awaitMessages(
                            (m) => m.author == message.author,
                            {
                                max: 1,
                                time: 1000 * 60 * 10,
                                errors: ["time"],
                            }
                        );
                    const projectDescription =
                        projectDescriptionProvided.first()?.content;
                    embed.addField("Description", projectDescription);
                    msg.edit(embed);
                    try {
                        const category = await message.guild.channels.cache.get(
                            guildSettings.communityProjectsCategory
                        );
                        await message.guild.channels
                            .create(projectName, {
                                reason: "Community Projects",
                                parent: category,
                                topic: projectDescription,
                            })
                            .then(async (channel) => {
                                await channel.lockPermissions();
                                channel.updateOverwrite(message.author, {
                                    MANAGE_CHANNELS: true,
                                    MANAGE_WEBHOOKS: true,
                                    MANAGE_MESSAGES: true,
                                });
                                let m = await channel.send(
                                    `${
                                        message.author
                                    } here's your Community Channel, you have Permission to Manage the Channel, Messages (for pinning) as well as ability to Manage Webhooks for your Git stuff\n\nPlease make sure that you follow these rules if you would like your community channel to stay\n\n${rules
                                        .map((rule) => rule)
                                        .join("\n")}`
                                );
                                m.pin();
                                await Member.updateOne(
                                    {
                                        userID: message.author.id,
                                        guildID: message.guild.id,
                                    },
                                    {
                                        communityChannels: [
                                            ...memberSettings.communityChannels,
                                            channel.id,
                                        ],
                                    }
                                );
                                message.channel.send(
                                    `☑️ Your Channel has been created! Check it out in ${channel} (${memberSettings.communityChannels.length + 1}/${guildSettings.communityProjectsLimit})`
                                );
                            });
                    } catch (e) {
                        throw new Error(
                            "There was an issue making your Community Project, Please Contact Staff"
                        );
                    }
                    break;
                case "❌":
                    msg.delete();
                    break;
            }
        });
    }
};
