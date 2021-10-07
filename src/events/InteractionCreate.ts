import {
    Interaction,
    MessageActionRow,
    MessageButton,
    MessageComponentInteraction,
    MessageEmbed,
    MessageSelectMenu,
    TextChannel,
} from "discord.js";
import FenixClient from "../lib/FenixClient";
import BaseEvent from "../structures/BaseEvent";
import { TextBasedChannels, GuildMember } from "discord.js";

export default class InteractionCreateEvent extends BaseEvent {
    constructor(client: FenixClient) {
        super(client, {
            name: "interactionCreate",
            enabled: true,
            event: "interactionCreate",
        });
    }
    async run(client: FenixClient, interaction: Interaction) {
        if (interaction.isCommand()) {
            if (!interaction.guild)
                interaction.reply({
                    content:
                        "Heya, I can only respond to Guild Commands! If you wish to contact staff please use the `/staff` command",
                });
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd)
                return interaction
                    .followUp("This command doesn't exist anymore!")
                    .then(() =>
                        client.guilds.cache.get(client.config.guildID)?.commands.delete(interaction.commandName),
                    );
            if (cmd.userPermissions.length > 0) {
                cmd.userPermissions.forEach((perm) => {
                    const userPerms = interaction.guild?.members.cache.get(interaction.member!.user.id)?.permissions;
                    if (!userPerms?.has(perm))
                        return interaction.reply({
                            content: `:warning: You don't have permission to run this command! Permissions Needed: \`${cmd.userPermissions.join(
                                "``, `",
                            )}\``,
                            ephemeral: true,
                        });
                });
            }

            if (cmd.botPermissions.length > 0) {
                cmd.botPermissions.forEach((perm) => {
                    const perms = interaction.guild?.me!.permissions;
                    if (!perms?.has(perm))
                        return interaction.reply({
                            content: `:warning: The bot don't have permission to run this command! Permissions Needed: \`${cmd.userPermissions.join(
                                "``, `",
                            )}\``,
                            ephemeral: true,
                        });
                });
            }

            if (cmd.ownerOnly) {
                if (this.client.config.owner !== interaction.user.id)
                    return interaction.reply({
                        content: `:warning: This command can be only ran by the Owner of the Bot!`,
                        ephemeral: true,
                    });
            }
            try {
                await cmd.run(interaction);
            } catch (e: any) {
                client._logger.error(e instanceof Error ? e.message : e);
                const embed = new MessageEmbed()
                    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor("RED")
                    .setDescription(`${e}`)
                    .setFooter(
                        `If this isn't a fixable problem on your side please dm ${
                            client.users.cache.get(this.client.config.owner)!.tag
                        }`,
                    );
                interaction.reply({ embeds: [embed] });
            }
        }
    }
}
