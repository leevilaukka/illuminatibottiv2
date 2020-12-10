const Guild = require("../models/Guild")

module.exports = async (client, deletedMessage) => {

    const newDoc = {
        author: {
            name: deletedMessage.author.username,
            discriminator: deletedMessage.author.discriminator,
            id: deletedMessage.author.id
        },
        message: deletedMessage.content,
        timestamp: new Date(Date.now()),
        messageID: deletedMessage.id,
        channelID: deletedMessage.channel.id,
        embeds: deletedMessage.embeds ? deletedMessage.embeds : null
    }

    Guild.findOneAndUpdate({guildID: deletedMessage.channel.guild.id}, {
        $push: {deletedMessages: newDoc}
    }).catch(e => console.error(e))
}
