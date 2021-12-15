// Structures
import { IlluminatiClient } from "./structures";
import { Intents } from "discord.js";

// Node modules
import mongoose from "mongoose";
import { setupImports } from "./setupImports";

const client = new IlluminatiClient(
    {
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
        userAgentSuffix: ["IlluminatiBotti"]
    },
    {
        connectionTimeout: 10000,
        ytdlOptions: {
            filter: "audioonly",
            highWaterMark: 1,
            dlChunkSize: 1 << 25
        },
    }
);



// Check if ownerID given
if (!client.config.ownerID && !client.isDevelopment) throw new Error("No ownerID given! Check your env variables.");

setupImports(client).then(() => console.log("Imports complete!"));

export const myExtractor = {
    version: "1.0.0",
    important: false,
    validate: (query) => true,
    getInfo: async (query) => {
        return {
            title: "Extracted by custom extractor",
            duration: 20000,
            thumbnail: "some thumbnail link",
            engine: `https://supla.digitacdn.net/live/_definst_/supla/${query}/chunklist.m3u8`,
            views: 0,
            author: "Some Artist",
            description: "",
            url: "https://supla.digitacdn.net/live/_definst_/supla/radiorock/chunklist.m3u8"
        };
    }
};


// Connect to database
mongoose.connect(
    process.env.MONGOURI,
    (cb: any) => {
        if (cb == !null) {
            console.error(cb);
        } else console.log("DB Connected!");
    }
);

// Bot client login
client.login(client.config.token).then(() => {
    if (client.isDevelopment) {
        console.log("Logged in as development version");
        const allAliases = client.commands.map(cmd => cmd.aliases && cmd.aliases).flat();
        console.log(`All aliases: `, allAliases);

    } else {
        console.log("Ready! ✔");
    }
});

