import { Guild, Snowflake } from 'discord.js';

const snowflakeRegex = /^(\d{17,19})$/;

export async function guildResolver(
    client: FurClient,
    snowflake: Snowflake
): Promise<Guild> {
    const guild = snowflakeRegex.test(snowflake)
        ? client.guilds.resolve(snowflake)
        : null;
    if (guild) return guild;
    throw new Error(`Invalid guild: ${snowflake}`);
}
