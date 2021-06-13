import mongoose, { Document, model, Schema } from "mongoose";

const GuildSchema: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true,
    },

    prefix: {
        type: String,
        required: true,
        default: ">",
    },

    disabledCommands: {
        type: Array,
        required: true,
    },

    bankerRole: {
        type: String,
        default: null,
    },

    bumpingChannel: {
        type: String,
        default: null,
    },
    staffMembers: {
        type: Array,
        default: null,
    },

    reputationSystem: {
        type: Boolean,
        default: false,
    },

    programmingChannels: {
        type: Array,
        default: [],
    },
});

export interface IGuild extends Document {
    guildID: string;
    prefix: string;
    disabledCommands: string[];
    bankerRole: string;
    bumpingChannel: string;
    staffMembers: string[];
    reputationSystem: boolean;
    programmingChannels: string[];
}

export const Guild = model<IGuild>("Guild", GuildSchema);
