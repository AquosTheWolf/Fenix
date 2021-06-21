import { Structures } from "discord.js";
import { findOneOrCreateGuild } from "../database";
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
            findOneOrCreateGuild(this.id);
        }

        public async settings() {
            return G.findOne({ guildID: this.id });
        }
    }
    return FurGuild;
});
