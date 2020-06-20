module.exports = {
    name: 'ping',
    description: 'Ping!',
    guildOnly: true,
    category: "general",
    cooldown: 5,
    execute(message, args) {
        message.channel.send('Pong.');
    },
};