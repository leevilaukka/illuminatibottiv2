module.exports = {
    name: 'pause',
    description: 'desc',
    execute(message, args, settings, client) {
        client.player.pause()
    }
}