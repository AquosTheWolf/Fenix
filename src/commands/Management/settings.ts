import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Command } from 'nukejs';

import { Guild } from '../../database/models/GuildConfig';
import settings from '../../settings';
import { channelResolver } from '../../utils/resolvers/channelResolver';
import { roleNameResolver } from '../../utils/resolvers/roleNameResolver';
import { usernameResolver } from '../../utils/resolvers/usernameResolver';

module.exports = class extends Command {
    constructor(file: any) {
        super(file, {
            name: 'settings',
            category: 'Management',
            runIn: ['text'],
            aliases: ['setting'],
            botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
            userPerms: ['MANAGE_GUILD'],
            cooldown: 0,
            description: 'View/Modify the guilds settings',
            enabled: true,
            usage: '<Staff|Guild> [settings] [additional Parameters]',
        });
    }

    async run(message: Message, args: string[], client: FurClient) {
        if (!message.guild) return;
        // Delete the original command message
        await message.delete();
        if (args[0]) {
            const gSettings = await message.guild.settings();
            switch (args[0]) {
                case 'staff':
                    if (!args[1]) {
                        const staffTeam = new MessageEmbed()
                            .setAuthor(
                                `${message.author.tag}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            )
                            .setTitle('Staff Settings')
                            .setColor(settings.primaryColor)
                            .addField(
                                `Staff Team`,
                                gSettings.staffMembers.length > 0
                                    ? gSettings.staffMembers
                                          .map(
                                              (staff) =>
                                                  message.guild.members.cache.get(
                                                      staff
                                                  ).user.tag
                                          )
                                          .join('\n')
                                    : "There's no Staff Set in the database"
                            )
                            .setFooter(
                                `User ID: ${message.author.id}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            );
                        return message.channel.send(staffTeam);
                    } else {
                        switch (args[1].toLowerCase()) {
                            case 'add':
                                if (!args[2])
                                    throw new Error(
                                        "Please provide a Username, Mention or ID of the staff member you're wanting to add"
                                    );
                                const addingStaff = await usernameResolver(
                                    message,
                                    args.slice(2).join(' ')
                                );
                                await Guild.updateOne(
                                    {
                                        guildID: message.guild.id,
                                    },
                                    {
                                        staffMembers: [
                                            ...gSettings.staffMembers,
                                            addingStaff.id,
                                        ],
                                    }
                                ).then(() => {
                                    message.reply(
                                        `Added ${addingStaff.username} to the Staff Team!`
                                    );
                                });
                                break;
                            case 'remove':
                                if (!args[2])
                                    throw new Error(
                                        "Please provide a Username, Mention or ID of the staff member you're wanting to add"
                                    );
                                const removingStaff = await usernameResolver(
                                    message,
                                    args.slice(2).join(' ')
                                );
                                await gSettings.staffMembers.splice(
                                    gSettings.staffMembers.indexOf(
                                        removingStaff.id
                                    ),
                                    1
                                );
                                await Guild.updateOne(
                                    {
                                        guildID: message.guild.id,
                                    },
                                    {
                                        staffMembers: [
                                            ...gSettings.staffMembers,
                                        ],
                                    }
                                ).then(() => {
                                    message.reply(
                                        `Removed ${removingStaff.username} to the Staff Team!`
                                    );
                                });
                                break;
                        }
                    }
                    break;
                case 'guild':
                    if (!args[1]) {
                        const embed = new MessageEmbed()
                            .setAuthor(
                                `${message.author.tag}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            )
                            .setColor(settings.primaryColor)
                            .setTitle('Guild Settings')
                            .addField('Guild ID:', `${gSettings.guildID}`, true)
                            .addField('Prefix:', `${gSettings.prefix}`, true)
                            .addField('Banker Role', gSettings.bankerRole)
                            .addField(
                                'Bumping Channel',
                                gSettings.bumpingChannel
                            )
                            .addField(
                                'Reputation System:',
                                `${gSettings.reputationSystem}`,
                                true
                            )
                            .addField(
                                'Programming Category',
                                gSettings.programmingCategory
                            )
                            .addField(
                                'Staff Bumping Channel',
                                gSettings.staffBumpingChannel
                            )
                            .addField(
                                'Community Projects Category',
                                gSettings.communityProjectsCategory
                            )
                            .addField(
                                'Community Projects Required Role',
                                gSettings.communityRequiredRole
                            )
                            .addField(
                                'Community Projects Limit',
                                gSettings.communityProjectsLimit
                            )
                            .setFooter(
                                `User ID: ${message.author.id}`,
                                `${message.author.displayAvatarURL({
                                    dynamic: true,
                                })}`
                            );
                        return message.channel.send(embed);
                    } else {
                        const type = args[1] as
                            | 'bankerRole'
                            | 'bumpingChannel'
                            | 'reputationSystem'
                            | 'programmingCategory'
                            | 'staffBumpingChannel'
                            | 'communityProjectsCategory'
                            | 'communityProjectsLimit'
                            | 'communityRequiredRole';
                        const settings = [
                            'bankerRole',
                            'bumpingChannel',
                            'reputationSystem',
                            'programmingCategory',
                            'staffBumpingChannel',
                            'communityProjectsCategory',
                            'communityProjectsLimit',
                            'communityRequiredRole',
                        ];

                        if (!settings.includes(type)) {
                            throw new Error(
                                `Please specify the correct settings you're wThng to modify\n\n\`\`\`${settings.join(
                                    '\n'
                                )}\n\`\`\``
                            );
                        }

                        if (
                            type === 'communityProjectsCategory' ||
                            type === 'programmingCategory' ||
                            type === 'bumpingChannel' ||
                            type === 'staffBumpingChannel'
                        ) {
                            const channel =
                                await message.guild.channels.cache.get(args[2]);
                            if (!channel && args[2]) {
                                throw new Error(
                                    'The 3rd parameter you provided is not a category nor channel id.'
                                );
                            }
                            if (channel && type) {
                                await Guild.updateOne(
                                    { guildID: message.guild.id },
                                    { [type]: channel.id }
                                );
                                let change;
                                if (
                                    channel?.type === 'category' ||
                                    channel.type === 'voice'
                                ) {
                                    change = channel.name;
                                } else {
                                    change = channel;
                                }
                                await message.reply(
                                    `Alrighty! ${type} is now set to send messages to ${change}`
                                );
                            } else {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    const chan =
                                        message.guild?.channels.resolve(
                                            settings[type]
                                        );
                                    await message.reply(
                                        `The current channel for type \`${type}\` is ${
                                            chan || 'Not Set'
                                        }!`
                                    );
                                }
                            }
                        } else if (
                            type === 'bankerRole' ||
                            type === 'communityRequiredRole'
                        ) {
                            if (!args[2]) {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    const role = message.guild?.roles.resolve(
                                        settings[type]
                                    );
                                    const embed = new MessageEmbed()
                                        .setColor('BLUE')
                                        .setDescription(
                                            `The current channel for type \`${type}\` is ${
                                                role || 'Not Set'
                                            }!`
                                        );
                                    await message.channel.send(embed);
                                }
                            } else {
                                const role = await roleNameResolver(
                                    message,
                                    args[2]
                                );
                                if (args[2] && role) {
                                    await Guild.updateOne(
                                        { guildID: message.guild.id },
                                        { [type]: role.id }
                                    );
                                    const embed =
                                        new MessageEmbed().setDescription(
                                            `Alrighty, ${type} is now set to ${role.name}`
                                        );
                                    await message.reply(embed);
                                }
                            }
                        } else if (type === 'communityProjectsLimit') {
                            if (!args[2]) {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    await message.reply(
                                        `The community project limit is ${settings[type]}!`
                                    );
                                }
                            } else {
                                if (isNaN(args[2] as unknown as number))
                                    throw new Error(
                                        'Please provide a number for the limit'
                                    );
                                else {
                                    await Guild.updateOne(
                                        { guildID: message.guild.id },
                                        {
                                            communityProjectsLimit: parseInt(
                                                args[2]
                                            ),
                                        }
                                    );
                                    await message.reply(
                                        `Alrighty! The community project limit is ${args[2]}!`
                                    );
                                }
                            }
                        } else if (type === 'reputationSystem') {
                            if (!args[2]) {
                                const settings = await message.guild.settings();
                                if (settings) {
                                    await message.reply(
                                        `The current channel for type \`${type}\` is ${settings[type]}!`
                                    );
                                }
                            } else {
                                const correctValues = ['true', 'false'];
                                if (!correctValues.includes(args[2]))
                                    throw new Error(
                                        'Please provide whether or not it should be true (to enable) or false (to disable)'
                                    );
                                else {
                                    await Guild.updateOne(
                                        { guildID: message.guild.id },
                                        { reputationSystem: Boolean(args[2]) }
                                    );
                                    await message.reply(
                                        `Alrighty! ${type} is now set to send messages to ${args[2]}`
                                    );
                                }
                            }
                        }
                    }
                    break;
            }
        } else {
            throw new Error(
                `You must provide a few arguements\n\n\`Example: //settings ${this.usage}\``
            );
        }
    }
};
