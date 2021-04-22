module.exports = {
    name: 'remove',
    description: 'Remove from queue',
    execute(message, args, settings, client) {
        client.player.queueDelete(args[0], message)
    }
}