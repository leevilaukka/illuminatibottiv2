module.exports = {
    name: "foorumi",
    description: "DiscordFoorumi-linkki",
    category: "other",
    execute(message, args, settings, client) {
        const data = {
            embed: {
                title: "DiscordFoorumi",
                url: "https://foorumi.leevila.fi",
                description: "Käy chekkaa DiscordFoorumi",
                color: 0x0000FF,
                author: {
                    name: "IlluminatiBotti",
                    icon_url: client.user.displayAvatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png"
                }
            }
        };
        console.table(data)
        message.channel.send(data).catch(e => console.error(e))
    }
};