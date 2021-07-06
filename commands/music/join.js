module.exports = {
    name: 'join',
    description: 'desc',
    outOfOrder: true,
    execute(message, args, settings, client) {
        client.player.join(message)
    }
}