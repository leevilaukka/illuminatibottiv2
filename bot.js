//Discord.js modules
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

//Cooldowns
const cooldowns = new Discord.Collection();

// Config
const {prefix} = require('./config.json');
const token = process.env.TOKEN;
// Node modules
const fs = require('fs');

// Command import
const commandFiles  = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message',message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // Not a command
    if (!command) {
       return message.reply(`tuota komentoa ei löytynyt, kirjoita \`${prefix}help\` saadaksesi apua komentojen kanssa.`);
    }

    //guildOnly check
    if (command.guildOnly && message.channel.type !== "text") {
        return message.reply('En voi suorittaa tätä komentoa yksityiskeskustelussa!');
    }

    //Args check
    if (command.args && !args.length) {
        let reply = `Anna puuttuvat argumentit, ${message.author}!`;

        if(command.usage) {
            reply += `\nOikea käyttötapa olisi: \`${prefix}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply);
    }
    //Cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }
    //Timestamps
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    //Cooldown check
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`odota ${timeLeft.toFixed(1)} sekunti(a) ennen kuin käytät \`${command.name}\` komentoa uudestaan.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    //Execute command and catch errors
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('komentoa suorittaessa tapahtui virhe');
    }
});

//Bot client login
client.login(token).then(() => console.log("Logged in!"));