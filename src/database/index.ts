import { Guild, IGuild } from "./models/GuildConfig";
import { Member } from "./models/MembersConfig";

/**
 * This function will find or create the Guild Database data with the provided Guild ID
 *
 * @param guildID Guild ID you're wanting to find or create
 * @returns {IGuild}
 */
export const findOneOrCreateGuild = async (guildID: string) => {
    const guild = await Guild.findOne({ guildID });
    if (guild) {
        return guild;
    } else {
        const guild = await Guild.create({
            guildID,
        });
        return guild;
    }
};

/**
 * This function will find or create the Member's Database data with the provided Guild ID and User ID
 * 
 * @param guildID Guild ID you're wanting to find the member data
 * @param userID User ID you're wanting to find and create
 * @returns {IMember}
 */
 export const findOneOrCreateMember = async (guildID: string, userID: string) => {
    const member = await Member.findOne({ guildID, userID });
    if (member) {
        return member;
    } else {
        const member = await Member.create({
            guildID,
            userID
        });
        return member;
    }
};