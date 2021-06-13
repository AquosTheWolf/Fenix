import mongoose, { Document, model, Schema } from "mongoose";

const MembersSchema: Schema = new Schema({
    guildID: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true,
    },

    bankCoins: {
        type: Number,
        default: 0,
    },

    coins: {
        type: Number,
        default: 0,
    },

    reps: {
        type: Number,
        default: 0,
    },

    xp: {
        type: Number,
        default: 0,
    },
});

export interface IMember extends Document {
    guildID: string
    userID: string
    bankCoins: number
    coins: number
    reps: number
    xp: number
}

export const Member = model<IMember>('Member', MembersSchema)