import mongoose from "mongoose";
const Schema = mongoose.Schema;
import config, { GuildSettings } from "../config.js";
import { IlluminatiEmbed } from "../structures/index.js";
import { Events } from "discord.js";

const pointSchema = new Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});

const PlaceSchema = new Schema({
    name: String,
    location: {
        type: pointSchema,
        required: true,
    },
    description: String,
});

const MemberSchema = new Schema({
    name: String,
    id: String,
    discriminator: String,
});

const TextChannelSchema = new Schema({
    name: String,
    id: String,
});

const DeletedMessageSchema = new Schema({
    message: String,
    author: MemberSchema,
    deletor: MemberSchema,
    timestamp: Date,
    messageID: String,
    channel: TextChannelSchema,
    embeds: Array,
});

type GuildProperties = {
    guildName: string;
    guildID: string;
    joinedAt: Date;
    removedMembers: (typeof MemberSchema)[];
    removedMemberChannel: string;
    deletedMessages: (typeof DeletedMessageSchema)[];
    places: (typeof PlaceSchema)[];
    embeds: IlluminatiEmbed[];
    disabledCommands: string[];
    mcdefaults: {
        action: string;
        host: string;
    };
    stacksEnabled: boolean;
    commandErrors: {
        [key: string]: number;
    };
    lastUsedVoiceChannel: string;
};

const GuildSchema = new Schema<GuildSettings & GuildProperties>({
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
        type: Number,
        default: config.defaultSettings.volume,
    },
    joinedAt: {
        type: Date,
        required: true,
    },
    lastUsedVoiceChannel: {
        type: String,
        default: null,
    },
    places: [PlaceSchema],
    removedMemberChannel: String,
    removedMembers: [MemberSchema],
    deletedMessages: [DeletedMessageSchema],
    randomMessages: {
        type: Boolean,
        default: true,
    },
    stacksEnabled: {
        type: Boolean,
        default: true,
    },
    throws: {
        type: [String],
        default: config.defaultSettings.throws,
    },
    mcdefaults: {
        action: String,
        host: String,
    },
    embeds: {
        type: [Object],
        default: config.defaultSettings.embeds,
    },
    disabledCommands: [String],
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
    }],
    musicQuiz: {
        playlists: {
            type: [String],
            default: config.defaultSettings.musicQuiz.playlists,
        },
        timeout: {
            type: Number,
            default: config.defaultSettings.musicQuiz.timeout,
        },
        points: {
            type: [Number],
            default: config.defaultSettings.musicQuiz.points,
        },
    },
});
const model = mongoose.model<GuildSettings>("Guild", GuildSchema);
export default model;


