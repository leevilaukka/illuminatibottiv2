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
                color: 0x0000FF
            }
        };
        message.channel.send(data).catch(e => console.error(e))
    }
};