module.exports = {
    name: 'queue',
    description: 'desc',
    execute(message, args, settings, client) {
        client.player.sendQueue(message)
    }
}