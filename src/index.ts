// Structures
import { Errors, IlluminatiClient } from "./structures";

// Node modules
import mongoose from "mongoose";
import setupImports from "./setupImports";

import { ActivityType, ErrorEvent } from "discord.js";

// Setup client
const client = new IlluminatiClient({
    intents: 36495,
    // Presence data
    presence: {
        status: "online",
        activities: [
            {
                name: "Isoveli valvoo 🔺",
                type: ActivityType.Custom,
            },
        ],
    },
});

// STARTUP
(async () => {
    // Check if ownerID given
    if (!client.config.ownerID && !client.isDevelopment) {
        throw new Errors.BotError(
            "No ownerID given! Check your env variables."
        );
    }
        

    await setupImports(client).then(() => console.log("Imports setup done!"));

    client.isDevelopment && console.log(client.eventNames());

    mongoose.set("strictQuery", false);
    // Connect to database
    mongoose.connect(process.env.MONGOURI, (mongoErr) => {
        if (mongoErr) {
            throw new Errors.DatabaseError(mongoErr.message);
        } else console.log("Connected to database! ✔");
    });

    process.on("warning", console.warn);

    // Bot client login
    await client
        .login(client.config.token)
        .then(() => {
            if (client.isDevelopment) {
                console.log("Logged in as development version");
                const allAliases = IlluminatiClient.commands
                    .map((cmd) => (cmd.aliases ? cmd.aliases : []))
                    .flat();
                console.log(`All aliases: `, allAliases);

                // If maching aliases found, throw error
                if (
                    allAliases.some(
                        (alias) =>
                            allAliases.filter((a) => a === alias).length > 1
                    )
                ) {
                    throw new Errors.BotError(
                        `Duplicate aliases found! Check your commands.`
                    );
                }
            } else {
                console.log("Ready! ✔");
            }
        })
        .catch((err: Error) => {
            if (err.message.includes("invalid token")) {
                console.error("Invalid token!");
                process.exitCode = 1
            } else {
                throw new Errors.BotError(err.message);
            }
        });
})();
