//Discord.js modules
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Config
require('./utils/functions')(client);
client.config = require('./config');

// Node modules
const fs = require('fs');
const mongoose = require("mongoose");
const isDevelopment = require("./helpers/nodeHelpers/isDevelopment")

// Event import
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const evt = require(`./events/${file}`);
    let evtName = file.split(".")[0];
    console.log(`Loaded evt: ${evtName}`);
    client.on(evtName, evt.bind(null, client))
}

// Command import
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Loaded cmd: ${command.name}`)
}

// Connect to database
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, cb => {
    if (cb ==! null && isDevelopment()) {
        console.error(cb)
    } else console.log("DB Connected!")
});

//Bot client login
client.login(client.config.token).then(() => {
    if (isDevelopment()) {
        console.log("Logged in as development version")
    } else {
        console.log("Logged in!")
    }
});
