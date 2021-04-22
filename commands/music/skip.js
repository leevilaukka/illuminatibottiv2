module.exports = {
    name: 'skip',
    description: 'Skip current song',
    execute(message, args, settings, client) {
        client.player.skip(message)
    }
}