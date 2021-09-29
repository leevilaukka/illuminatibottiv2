// Structures
import { IlluminatiClient } from "./structures";
import { Intents } from "discord.js";

// Node modules
import mongoose from "mongoose";
import { setupImports } from "./setupImports";

const client = new IlluminatiClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES], userAgentSuffix: ["IlluminatiBotti"]});

// Check if ownerID given
if (!client.config.ownerID && !client.isDevelopment) throw new Error("No ownerID given! Check your env variables.");

setupImports(client).then(() => console.log("Imports complete!"));

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
        console.log("Client:", client)
    } else {
        console.log("Ready! ✔");
    }
});

