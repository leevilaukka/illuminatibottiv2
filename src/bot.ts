// Structures
import { IlluminatiClient } from "./structures";
import { Intents, Message } from "discord.js";

import { PlayerError } from "discord-player";

const client = new IlluminatiClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// DiscordPlayer
client.player.on("error", (error: PlayerError, message: Message) => {
    message.channel.send(error.message)
})

// Node modules
import fs from "fs";
import mongoose from "mongoose";

// Check if ownerID given
if (!client.config.ownerID && !client.isDevelopment) throw new Error("No ownerID given! Check env variables.");

// Event import
try {
    const eventFiles = fs
        .readdirSync(`${__dirname}/events/`)
        .filter((file: string) => file.endsWith(".js"))

    for (const file of eventFiles) {
        const evt = require(`${__dirname}/events/${file}`).default;
        console.log(evt)
        let evtName = file.split(".")[0];
        if (client.isDevelopment) console.log(`Loaded evt: ${evtName}`);
        client.on(evtName, evt.bind(null, client));
    }
} catch (error) {
    console.error(error)
}

console.log("Events loaded!")

// Command import
const commandFolders = fs.readdirSync(`${__dirname}/commands/`)
for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`${__dirname}/commands/${folder}`)
        .filter((file: string) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`${__dirname}/commands/${folder}/${file}`).default;
        console.log(command)
        client.commands.set(command.name, command);
        if (client.isDevelopment) console.log(`Loaded cmd: ${folder}/${file}`);
    }
}

console.log("Commands loaded!");

// Connect to database
mongoose.connect(
    process.env.MONGOURI, {
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
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
        console.log("Client: ", client)
    } else {
        console.log("Ready! ✔");
    }
});
