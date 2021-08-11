// Structures
import { IlluminatiClient } from "./structures";
import { Intents } from "discord.js";
import Command from "./types/IlluminatiCommand";

// Node modules
import fs from "fs";
import mongoose from "mongoose";

const client = new IlluminatiClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]});

// Check if ownerID given
if (!client.config.ownerID && !client.isDevelopment) throw new Error("No ownerID given! Check your env variables.");

// Event import
try {
    const eventFiles = fs
        .readdirSync(`${__dirname}/events/discord/`)
        .filter((file: string) => file.endsWith(".js"))

    for (const file of eventFiles) {
        import(`${__dirname}/events/${file}`).then(({default: evt}) => {
            let evtName = file.split(".")[0];
            if (client.isDevelopment) console.log(`Loaded discordEvt: ${evtName}`);
            client.on(evtName, evt.bind(null, client));
        })
    }
} catch (error) {
    console.error(error)
}

try {
    const playerEventFiles = fs
        .readdirSync(`${__dirname}/events/player/`)
        .filter((file: string) => file.endsWith(".js"))

    for (const file of playerEventFiles) {
        import(`${__dirname}/events/player/${file}`).then(({default: evt}) => {
            console.log(evt)
            let evtName: any = file.split(".")[0];
            if (client.isDevelopment) console.log(`Loaded playerEvt: ${evtName}`);
            client.player.on(evtName, evt.bind(null, client));
        })
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

    for(const file of commandFiles) {
        import(`${__dirname}/commands/${folder}/${file}`).then(({default : cmd}) => {
            const command: Command = cmd
            console.log(command)
            client.commands.set(command.name, command);
            if (client.isDevelopment) console.log(`Loaded cmd: ${folder}/${file}`);
        }).catch(console.error)
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
