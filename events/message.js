const Discord = require("discord.js");
const config = require("../config");

const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
    let settings;
    try {
        if (message.channel.type === "dm") {
            settings = client.config.defaultSettings;
        } else {
            settings = await client.getGuild(message.guild);
        }
    } catch (e) {
        console.error(e);
    }

    if (message.author.bot) return;

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const prefixRegex = new RegExp(
        `^(<@!?${client.user.id}>|${escapeRegex(settings.prefix)})\\s*`
    );

    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
        );

    // Not a command
    if (!command) {
        return message.reply(
            `tuota komentoa ei löytynyt, kirjoita \`${settings.prefix}help\` saadaksesi apua komentojen kanssa.`
        );
    }

    //Permissons check
    if (
        command.permissions &&
        message.channel.type !== "dm" &&
        !message.member.hasPermission(command.permissions)
    ) {
        return message.reply("sinulla ei ole oikeuksia käyttää tätä komentoa");
    }

    //guildOnly check
    if (command.guildOnly && message.channel.type !== "text") {
        return message.reply(
            "En voi suorittaa tätä komentoa yksityiskeskustelussa!"
        );
    }

    //ownerOnly check
    if (command.ownerOnly && message.author.id !== config.ownerID) {
        return message.reply(
            "et omista minua! Komennon voi suorittaa vain tämän botin omistaja."
        );
    }

    //Args check
    if (command.args && !args.length) {
        let reply = `Anna puuttuvat argumentit, ${message.author}!`;

        if (command.usage) {
            reply += `\nOikea käyttötapa olisi: \`${settings.prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }
    //Cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    //Timestamps
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    //Cooldown check
    if (timestamps.has(message.author.id)) {
        const expirationTime =
            timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(
                `odota ${timeLeft.toFixed(1)} sekunti(a) ennen kuin käytät \`${
                    command.name
                }\` komentoa uudestaan.`
            );
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    if (client.isDevelopment) console.log(`Cmd ${command.name} called!`);

    //Execute command and catch errors
    try {
        message.channel.startTyping();
        await command.execute(message, args, settings, client);
        message.channel.stopTyping(true);
    } catch (error) {
        console.error(error);
        const errorMessage = await message.reply("komentoa suorittaessa tapahtui virhe");
        setTimeout(() => errorMessage.delete(), 5000);
    }
};
