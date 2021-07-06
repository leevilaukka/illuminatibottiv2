module.exports = {
    name: 'loop',
    description: 'desc',
    outOfOrder: true,
    execute(message, args, settings, client) {
        client.player.toggleLoop(message)
    }
}