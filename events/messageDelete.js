const Guild = require("../models/Guild")

module.exports = async (client, deletedMessage) => {
    console.log(deletedMessage)

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

    console.log(newDoc)
    console.log(deletedMessage.channel.guild.id)
    Guild.findOneAndUpdate({guildID: deletedMessage.channel.guild.id}, {
        $push: {deletedMessages: newDoc}
    }).catch(e => console.error(e))
}
