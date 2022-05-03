import Command, { Categories } from '../../../types/IlluminatiCommand'

const command: Command = {
    name: 'ping',
    description: 'Ping!',
    guildOnly: true,
    category: Categories.general,
    cooldown: 5,
    options: [{
        name: "input",
        type: "STRING",
        description: "Input"
    }],
    enableSlash: true,
    async run(message, args, _settings, client) {
        message.reply({
            content: `Pong! Viive on ${Math.ceil(client.ws.ping)}ms. Ensimmäinen argumentti oli ${args[0]}`,
        })
    },
    async onInit(client) {
        console.log(`Init works!`, client)
    }       
};

export default command