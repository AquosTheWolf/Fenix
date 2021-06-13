import mongoose, { Schema } from "mongoose";

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
