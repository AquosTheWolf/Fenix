import { Structures } from 'discord.js';
import { findOneOrCreateMember } from '../database';
import { IMember, Member } from '../database/models/MembersConfig';

declare module 'discord.js' {
    export interface GuildMember {
        settings(): Promise<IMember>;
    }
}

Structures.extend('GuildMember', (GuildMember) => {
    class FurMember extends GuildMember {
        constructor(client, data, guild) {
            super(client, data, guild);
            findOneOrCreateMember(this.guild.id, this.id);
        }

        public async settings() {
            return Member.findOne({ guildID: this.guild.id, userID: this.id });
        }
    }

    return FurMember;
});
