const Guild = require("../models/Guild")

module.exports = async (client, deletedMessage) => {

    if(!deletedMessage.guild) return;
    
    
    const fetchedLogs = await deletedMessage.guild.fetchAuditLogs({
       limit: 1,
       type: "MESSAGE_DELETE"
    });

    // Pick first entry from deletedLog and destructure executor out
    const deletedLog = fetchedLogs.entries.first();
    if(!deletedLog) return;
    const {executor} = deletedLog;

    // If executor is a bot account, return
    if(executor.bot) return;

    console.log(deletedMessage)
    const {author, content: message, id: messageID, channel, embeds} = deletedMessage;
    const newDoc = {
        author: {
            name: author.username,
            discriminator: author.discriminator,
            id: author.id
        },
        deletor: executor ? {
            name: executor.username,
            discriminator: executor.discriminator,
            id: executor.id
        } : null,
        message,
        timestamp: new Date(Date.now()),
        messageID,
        channel: {
            name: channel.name,
            id: channel.id
        },
        embeds
    }

    Guild.findOneAndUpdate({guildID: deletedMessage.channel.guild.id}, {
        $push: {deletedMessages: newDoc}
    }).catch(e => console.error(e))
}
