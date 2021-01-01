const Guild = require("../models/Guild")
const message = require("./message")

module.exports = async (client, deletedMessage) => {

    if(!deletedMessage.guild) return;
    
    const fetchedLogs = await deletedMessage.guild.fetchAuditLogs({
       limit: 1,
       type: "MESSAGE_DELETE"
    });

    const deletedLog = fetchedLogs.entries.first();
    const {executor} = deletedLog;

    const newDoc = {
        author: {
            name: deletedMessage.author.username,
            discriminator: deletedMessage.author.discriminator,
            id: deletedMessage.author.id
        },
        deletor: executor ? {
            name: executor.username,
            discriminator: executor.discriminator,
            id: executor.id
        } : null,
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
