module.exports = {
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
        const sender = interaction || message
        
        sender.reply(`Pong! Viive on ${Math.ceil(client.ws.ping)}ms. Ensimmäinen argumentti oli ${args[0]}`)        
    },
};