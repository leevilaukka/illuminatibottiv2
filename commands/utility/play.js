
module.exports = {
    name: 'play',
    description: 'desc',
    execute(message, args, settings, client) {
        client.player.play(args[0], message)
    }
}