const Discord = require("discord.js");

const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
    let settings;
    try {
        if(message.channel.type === "dm"){
            settings = client.config.defaultSettings
        } else {
            settings = await client.getGuild(message.guild)
        }

    } catch (e) {
        console.error(e)
    }

    if(!message.content.startsWith(settings.prefix) || message.author.bot) return;

    const args = message.content.slice(settings.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // Not a command
    if (!command) {
        return message.reply(`tuota komentoa ei löytynyt, kirjoita \`${settings.prefix}help\` saadaksesi apua komentojen kanssa.`);
    }

    //guildOnly check
    if (command.guildOnly && message.channel.type !== "text") {
        return message.reply('En voi suorittaa tätä komentoa yksityiskeskustelussa!');
    }

    //Args check
    if (command.args && !args.length) {
        let reply = `Anna puuttuvat argumentit, ${message.author}!`;

        if(command.usage) {
            reply += `\nOikea käyttötapa olisi: \`${settings.prefix}${command.name} ${command.usage}\``
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
        command.execute(message, args, settings, client);
    } catch (error) {
        console.error(error);
        await message.reply('komentoa suorittaessa tapahtui virhe');
    }
};