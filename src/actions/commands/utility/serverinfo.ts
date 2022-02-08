import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'serverinfo',
    description: 'Näyttää tietoja palvelimesta',
    guildOnly: true,
    aliases: ['servu'],
    cooldown: 5,
    category: Categories.general,
    async run(message, args, settings, client) {
        message.channel.send(`Nimi: ${message.guild.name}\nJäseniä: ${message.guild.memberCount}`);
    },
};

export default command