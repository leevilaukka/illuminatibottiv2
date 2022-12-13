import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'ping',
    description: 'Ping!',
    guildOnly: true,
    category: Categories.utility,
    cooldown: 5,
    async run(message, args, _settings, client) {
        message.reply({
            content: `Pong! Viive on ${Math.ceil(client.wsPing)}ms.`,
        })
    }
};

export default command