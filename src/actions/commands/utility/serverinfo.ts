import Command from "../../../types/IlluminatiCommand";

const command: Command = {
    name: 'serverinfo',
    description: 'Näyttää tietoja palvelimesta',
    guildOnly: true,
    aliases: ['servu'],
    cooldown: 5,
    category: "general",
    execute(message, args, settings, client) {
        message.channel.send(`Nimi: ${message.guild.name}\nJäseniä: ${message.guild.memberCount}`);
    },
};

export default command