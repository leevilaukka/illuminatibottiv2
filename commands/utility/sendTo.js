module.exports = {
    name: 'sendTo',
    description: 'Näyttää tietoja palvelimesta',
    guildOnly: true,
    aliases: ['lähetä'],
    cooldown: 5,
    category: "general",
    execute(message, args, settings, client) {
        const messagearg = args[1]
        const regex = /[0-9]/g
        const channelmatch = args[0].match(regex).join("")

        client.channels.cache.find(channel => channel.id === channelmatch).send(messagearg)
    },
};
