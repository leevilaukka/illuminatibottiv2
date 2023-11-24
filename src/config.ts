import { Embed } from "discord.js";
import { IlluminatiEmbed } from "./structures";
import { ObjectId } from "mongodb";
import { Url } from "url";
import { Mongoose } from "mongoose";

export type Config = {
    token: string;
    devServerID: string;
    ownerID: string;
    defaultSettings: GuildSettings;
};

export type DeletedMessage = {
    message: String;
    author: {
        name: string;
        discriminator: string;
        id: string;
    };
    deletor: {
        name: string;
        discriminator: string;
        id: string;
    };
    timestamp: number;
    messageID: string;
    channel: {
        name: string;
        id: string;
    };
    embeds: Embed[];
};

export type GuildSettings = {
    prefix: string;
    volume: number;
    randomMessages: boolean;
    minecraft: {
        action: string;
        host: string;
    };
    embeds: IlluminatiEmbed[];
    leaveOnEmpty: boolean;
    throws: Array<string>;
    places: {
        name: string;
        location: {
            type: string;
            coordinates: [number, number];
        };
    }[];
    disabledCommands: string[];
    removedMemberChannel: string;
    deletedMessages: DeletedMessage[];
    commandErrors: {
        [key: string]: number;
    };
    stacksEnabled: boolean;
    playlists: ObjectId[];
    lastUsedVoiceChannel: string;
    musicQuiz: {
        playlists: string[];
        timeout: number;
        points: [number, number];
        rounds: number;
        wins: Map<string, number>;
    };
};

const config = {
    token: process.env.TOKEN,
    devServerID: process.env.DEVSERVERID,
    ownerID: process.env.OWNERID,
    defaultSettings: {
        // CHANGE THESE TO YOUR OWN IF HOSTING

        // Channel to send notifications of removed members to
        removedMemberChannel: "",

        // Leave voice channel when empty
        leaveOnEmpty: false,

        // Prefix for commands
        prefix: "*",

        // Volume of the bot
        volume: 1,

        // Random messages
        randomMessages: false,

        // Minecraft server defaults
        minecraft: {
            action: "status",
            host: process.env.MCHOST,
        },

        // Don't edit these
        embeds: [] as IlluminatiEmbed[],
        places: [] as {
            name: string;
            location: {
                type: string;
                coordinates: [number, number];
            };
        }[],
        throws: [] as string[],
        disabledCommands: [] as string[],
        deletedMessages: [] as DeletedMessage[],
        commandErrors: {} as {
            [key: string]: number;
        },
        stacksEnabled: true,
        playlists: [] as ObjectId[],
        lastUsedVoiceChannel: "",
        musicQuiz: {
            rounds: 10 as number,
            points: [2, 1] as [number, number],
            playlists: [
                "https://open.spotify.com/playlist/3BnxpQEIcpsEIB0eY8WfJB?si=cfd96cb1202a4d4b"
            ] as string[],
            timeout: 30000 as number,
            wins: {} as Map<string, number>,
            answerThresholds: [0.5, 0.75] as [number, number],
        },
    },
} as const;

export default config;
