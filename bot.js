//Discord.js modules
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

//Cooldowns
const cooldowns = new Discord.Collection();

// Config
const {prefix, token} = require('./config.json');

// Node modules
const fs = require('fs');

// Command import
const commandFiles  = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setPresence({ game: {name: "Under coding"}, status: "idle"})
        .catch(console.error)
});

client.on('message',message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== "text") {
        return message.reply('En voi suorittaa tätä komentoa yksityiskeskustelussa!');
    }

    if (command.args && !args.length) {
        let reply = `Anna puuttuvat argumentit, ${message.author}!`;

        if(command.usage) {
            reply += `\nOikea käyttötapa olisi: \`${prefix}${command.name} ${command.usage}\``
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`odota ${timeLeft.toFixed(1)} sekunti(a) ennen kuin käytät \`${command.name}\` komentoa uudestaan.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('komentoa suorittaessa tapahtui virhe');
    }
});


client.login(token).then(() => console.log("Logged in!"));