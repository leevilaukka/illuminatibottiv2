import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: 'ping',
    description: 'Ping!',
    guildOnly: true,
    category: "general",
    cooldown: 5,
    options: [{
        name: "input",
        type: "STRING",
        description: "Input"
    }],
    enableSlash: true,
    execute(message, args, _settings, client, interaction) {
        message.reply(`Pong! Viive on ${Math.ceil(client.ws.ping)}ms. Ensimmäinen argumentti oli ${args[0]}`)
    },
};

export default command