module.exports = {
    name: 'queue',
    description: 'desc',
    aliases: ["q"],
    execute(message, args, settings, client) {
        client.player.sendQueue(message)
    }
}