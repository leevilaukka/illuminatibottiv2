module.exports = {
    name: 'loop',
    description: 'desc',
    execute(message, args, settings, client) {
        client.player.toggleLoop(message)
    }
}