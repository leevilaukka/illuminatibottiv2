const { argsToString } = require("../../helpers")

module.exports = {
    name: 'play',
    description: 'Soita kappaleita Youtubesta',
    aliases: ["p", "soita"],
    execute(message, args, settings, client) {
        client.player.play(argsToString(args), message)
    }
}