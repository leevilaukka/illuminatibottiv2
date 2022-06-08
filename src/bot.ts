// Structures
import { IlluminatiClient } from "./structures";
import { Intents } from "discord.js";

// Node modules
import mongoose from "mongoose";
import setupImports from "./setupImports";

const client = new IlluminatiClient(
    {
        intents: 36495,
        userAgentSuffix: ["IlluminatiBotti"],
        presence: {
            status: "online",
            activities: [{
                name: "over the Illuminati",
                type: 3
            }]
        },
    },
    {
        connectionTimeout: 1000 * 30, // 30 seconds
        ytdlOptions: {
            filter: "audioonly",
            highWaterMark: 1 << 62,
            liveBuffer: 1 << 62,
            dlChunkSize: 0, //disabling chunking is recommended in discord bot
        },
    }
);

(async () => {
    // Check if ownerID given
    if (!client.config.ownerID && !client.isDevelopment) throw new Error("No ownerID given! Check your env variables.");

    await setupImports(client).then(() => console.log("Setup imports done!"));

    // Connect to database
    mongoose.connect(
        process.env.MONGOURI,
        (cb: any) => {
            if (cb == true) {
                console.error(cb);
            } else console.log("DB Connected!");
        }
    );

    // Bot client login
    await client.login(client.config.token).then(() => {
        if (client.isDevelopment) {
            console.log("Logged in as development version");
            const allAliases = IlluminatiClient.commands.map(cmd => cmd.aliases && cmd.aliases).flat();
            console.log(`All aliases: `, allAliases);

        } else {
            console.log("Ready! ✔");
        }
    });

    console.log(client.toString());
})();