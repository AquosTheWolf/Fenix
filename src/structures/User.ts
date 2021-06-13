import { Structures } from "discord.js";
import { IMember, Member } from "../database/models/MembersConfig";

declare module "discord.js" {
    interface User {
        getUserSettings(guildID: string, userID: string): Promise<IMember>;
    }
}

Structures.extend("User", (User) => {
    class FurUser extends User {
        constructor(client, data) {
            super(client, data);
        }

        async getUserSettings(guildID: string, userID: string) {
            return Member.findOne({ guildID: guildID, userID: userID });
        }
    }

    return FurUser;
});
