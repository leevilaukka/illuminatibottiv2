module.exports = {
    name: 'play',
    description: 'Soita kappaleita Youtubesta',
    aliases: ["p", "soita"],
    execute(message, args, settings, client) {
        client.player.play(args[0], message)
    }
}