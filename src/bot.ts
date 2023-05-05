// Structures
import { Errors, IlluminatiClient } from "./structures";

// Node modules
import mongoose from "mongoose";
import setupImports from "./setupImports";
import io from "@pm2/io"

import { Queue } from "discord-player";

// Setup client
const client = new IlluminatiClient(
    {
        intents: 36495,
        // Presence data
        presence: {
            status: "online",
            activities: [{
                name: "over the Illuminati",
                type: 3
            }]
        },
    },
    // YTDL options
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


// STARTUP
(async () => {
    // Check if ownerID given
    if (!client.config.ownerID && !client.isDevelopment) throw new Errors.BotError("No ownerID given! Check your env variables.");

    await setupImports(client).then(() => console.log("Imports setup done!"));

    client.isDevelopment && console.log(client.eventNames())

    client.on("trackAdd", (queue, track) => {
        console.log(queue, track)
    })

    // Connect to database
    mongoose.connect(
        process.env.MONGOURI,
        (mongoErr) => {
            if (mongoErr) {
                throw new Errors.DatabaseError(mongoErr.message);
            } else console.log("Connected to database! ✔");
        }
    );

    // Initiate pm2 metrics
    io.init({
        profiling: true,
        metrics: {
            network: true,
            http: true,
            runtime: true,
        },
        tracing: true
    })

    client.setMaxListeners(20)

    // Bot client login
    await client.login(client.config.token).then(() => {
        if (client.isDevelopment) {
            console.log("Logged in as development version");
            const allAliases = IlluminatiClient.commands.map(cmd => cmd.aliases && cmd.aliases).flat();
            console.log(`All aliases: `, allAliases);

        } else {
            console.log("Ready! ✔");
        }
    })
    .catch((err: any) => {
        if (err.message.includes("invalid token")) {
            throw new Errors.BotError("Invalid token!");
        } else {
            throw new Errors.BotError(err.message);
        }
    });
})();


// Exrpess types
declare global {
    namespace Express {
        export interface Request {
            client?: IlluminatiClient;
            queue?: Queue;
        }
    }
}