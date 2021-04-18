module.exports = {
    name: 'ping',
    description: 'Ping!',
    guildOnly: true,
    category: "general",
    cooldown: 5,
    execute(message, _args, _settings, client) {
        message.channel.send(`Pong! Viive on ${Math.ceil(client.ws.ping)}ms`)        
    },
};