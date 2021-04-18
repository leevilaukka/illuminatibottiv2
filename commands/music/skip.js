module.exports = {
    name: 'skip',
    description: 'desc',
    execute(message, args, settings, client) {
        client.player.skip(message)
    }
}