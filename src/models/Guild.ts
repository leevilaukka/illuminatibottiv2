import mongoose from "mongoose"
const Schema = mongoose.Schema;
import config from "../config.js";

const PlaceSchema = new Schema({
    name: String,
    coords: {
        lat: Number,
        lon: Number,
    },
});

const MemberSchema = new Schema({
    name: String,
    id: String,
    discriminator: String
});

const TextChannelSchema = new Schema({
    name: String,
    id: String
})

const DeletedMessageSchema = new Schema({
    message: String,
    author: MemberSchema,
    deletor: MemberSchema,
    timestamp: Date,
    messageID: String,
    channel: TextChannelSchema,
    embeds: Array,
});

const GuildSchema = new Schema({
    guildName: {
        type: String,
        required: true,
    },
    guildID: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        default: config.defaultSettings.prefix,
    },
    volume: {
        type: String,
        default: config.defaultSettings.volume,
    },
    joinedAt: {
        type: Date,
        required: true,
    },
    places: [PlaceSchema],
    removedMemberChannel: String,
    removedMembers: [MemberSchema],
    deletedMessages: [DeletedMessageSchema],
    randomMessages: {
        type: Boolean,
        default: true
    },
    throws: {
        type: Array,
        default: config.defaultSettings.throws,
    },
    mcdefaults: {
        action: String,
        host: String
    }
});

export default mongoose.model("Guild", GuildSchema);
