//Discord.js modules
import {Structures} from "discord.js";

const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

// Config
require('./utils/functions')(client);
client.config = require('./config');


// Node modules
const fs = require('fs');
const mongoose = require("mongoose");

// Event import
const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const evt = require(`./events/${file}`);
    let evtName = file.split(".")[0];
    console.log(`Loaded evt: ${evtName}`);
    client.on(evtName, evt.bind(null, client))
}

Structures.extend('Guild', function(Guild) {
    class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.musicData = {
                queue: [],
                isPlaying: false,
                nowPlaying: null,
                songDispatcher: null,
                skipTimer: false, // only skip if user used leave command
                loopSong: false,
                loopQueue: false,
                volume: 1
            };
            this.triviaData = {
                isTriviaRunning: false,
                wasTriviaEndCalled: false,
                triviaQueue: [],
                triviaScore: new Map()
            };
        }
    }
    return MusicGuild;
});

// Command import
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Connect to database
mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log("DB Connected!"));

//Bot client login
client.login(client.config.token).then(() => console.log("Logged in!"));