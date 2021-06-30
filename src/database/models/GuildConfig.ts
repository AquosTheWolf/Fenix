import { Document, model, Schema } from 'mongoose';

const GuildSchema: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
        unique: true
    },

    prefix: {
        type: String,
        required: true,
        default: '>'
    },

    disabledCommands: {
        type: Array,
        default: []
    },

    bankerRole: {
        type: String,
        default: null
    },

    bumpingChannel: {
        type: String,
        default: null
    },

    staffBumpingChannel: {
        type: String,
        default: null
    },

    staffMembers: {
        type: Array,
        default: []
    },

    reputationSystem: {
        type: Boolean,
        default: false
    },

    programmingCategory: {
        type: String,
        default: null
    },

    communityProjectsCategory: {
        type: String,
        default: null
    },

    communityProjectsLimit: {
        type: Number,
        default: 3
    },

    communityRequiredRole: {
        type: String,
        default: null
    }
});

export interface IGuild extends Document {
    guildID: string;
    prefix: string;
    disabledCommands: string[];
    bankerRole: string;
    bumpingChannel: string;
    staffMembers: string[];
    reputationSystem: boolean;
    programmingCategory: string;
    staffBumpingChannel: string;
    communityProjectsCategory: string;
    communityProjectsLimit: number;
    communityRequiredRole: string;
}

export const Guild = model<IGuild>('Guild', GuildSchema);
