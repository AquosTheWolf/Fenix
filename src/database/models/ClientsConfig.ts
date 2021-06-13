import mongoose, { model, Schema, Document } from "mongoose";

const ClientSchema: Schema = new Schema({
    whiteListedGuilds: {
        type: Array,
        default: ["731520035717251142", "849343018939187231"],
    },

    maintenance: {
        type: Boolean,
        default: false,
    },
});

interface IClient extends Document {
    whiteListedGuilds: string[];
    maintenance: boolean;
}

export const Client = model<IClient>("Client", ClientSchema);
