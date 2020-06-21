module.exports = {
    name: "foorumi",
    description: "DiscordFoorumi-linkki",
    category: "other",
    execute(message, args) {
        const data = {
            embed: {
                title: "DiscordFoorumi",
                url: "https://foorumi.leevila.me",
                description: "Käy chekkaa DiscordFoorumi",
                color: 0x0000FF,
                author: {
                    name: "IlluminatiBotti",
                    icon_url: client.user.avatarURL()
                }
            }
        };
        message.channel.send(data).catch(e => console.error(e))
    }
};