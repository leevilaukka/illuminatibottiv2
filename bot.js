// Structures
const IlluminatiClient = require("./structures/IlluminatiClient");

// Discord.js modules
const client = new IlluminatiClient();

// Node modules
const fs = require("fs");
const mongoose = require("mongoose");
const { isDevelopment } = require("./helpers/nodeHelpers");

// Check if ownerID given
if (!client.config.ownerID) throw new Error("No ownerID given! Check env variables.");

// Event import
const eventFiles = fs
    .readdirSync("./events/")
    .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
    const evt = require(`./events/${file}`);
    let evtName = file.split(".")[0];
    console.log(`Loaded evt: ${evtName}`);
    client.on(evtName, evt.bind(null, client));
}

// Command import
const commandFolders = fs.readdirSync("./commands")
for(folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
        if (isDevelopment()) console.log(`Loaded cmd: ${folder}/${file}`);
    }
}
if (!isDevelopment()) console.log("Commands loaded!");

// Connect to database
mongoose.connect(
    process.env.MONGOURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (cb) => {
        if (cb) {
            console.error(cb);
        } else console.log("DB Connected!");
    }
);

// Bot client login
client.login(client.config.token).then(() => {
    if (isDevelopment()) {
        console.log("Logged in as development version");
    } else {
        console.log("Logged in!");
    }
    client.user.setPresence({activity: {name: `Online on ${client.guilds.cache.size} servers`}, status: "online"})
});