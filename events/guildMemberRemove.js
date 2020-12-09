const Guild = require("../models/Guild")

module.exports = async (client, removedMember) => {
    const newDoc = {
        name: removedMember.user.username,
        id: removedMember.id
    }
    console.log("Joku poistu!")
    await Guild.findOneAndUpdate({guildID: removedMember.guild.id}, {
        $push: {removedMembers: newDoc}
    })
        .catch(e => console.error(e));

    await Guild.findOne({guildID: removedMember.guild.id})
        .then(doc => {
            const regex = /[0-9]/g
            const channelmatch = doc.removedMemberChannel.match(regex).join("")

            client.channels.cache.find(channel => channel.id === channelmatch).send(`Käyttäjä ${removedMember.nickname} poistui!`)
        })
        .catch(e => console.error(e));
}
