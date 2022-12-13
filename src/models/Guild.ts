import mongoose from "mongoose"
const Schema = mongoose.Schema;
import config, { GuildSettings } from "../config.js";

const pointSchema = new Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true     
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const PlaceSchema = new Schema({
    name: String,
    location: {
        type: pointSchema,
        required: true
    },
    description: String
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
    leaveOnEmpty: {
        type: Boolean,
        default: false,
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
    },
    embeds: {
        type: Array,
        default: config.defaultSettings.embeds
    },
    disabledCommands: [String],
});
const model = mongoose.model<GuildSettings>("Guild", GuildSchema);
export default model
