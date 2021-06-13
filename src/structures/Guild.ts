import { Structures } from "discord.js";
import { IGuild, Guild as G } from "../database/models/GuildConfig";

declare module "discord.js" {
    export interface Guild {
        settings(): Promise<IGuild>;
    }
}

Structures.extend("Guild", (Guild) => {
    class FurGuild extends Guild {
        constructor(client, data) {
            super(client, data);
        }

        public async settings() {
            return G.findOne({ guildID: this.id });
        }
    }
    return FurGuild;
});
