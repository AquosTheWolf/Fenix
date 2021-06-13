import mongoose, { Schema } from "mongoose";

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
