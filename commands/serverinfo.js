module.exports = {
    name: 'serverinfo',
    description: 'Näyttää tietoja palvelimesta',
    guildOnly: true,
    aliases: ['servu'],
    cooldown: 5,
    category: "general",
    execute(message, args) {
        message.channel.send(`Nimi: ${message.guild.name}\nJäseniä: ${message.guild.memberCount}`);
    },
};