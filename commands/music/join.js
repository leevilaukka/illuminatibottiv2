const IlluminatiPlayer = require("../../structures/IlluminatiPlayer")

module.exports = {
    name: 'join',
    description: 'desc',
    execute(message, args, settings, client) {
        client.player.join(message)
    }
}