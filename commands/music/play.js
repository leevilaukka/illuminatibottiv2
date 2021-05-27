const { argsToString } = require("../../helpers")

module.exports = {
    name: 'play',
    description: 'Soita kappaleita Youtubesta',
    aliases: ["p", "soita"],
    async execute(message, args, settings, client) {
        client.player.play(message, args[0])
    }
}