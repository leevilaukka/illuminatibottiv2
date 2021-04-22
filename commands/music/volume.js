module.exports = {
    name: "volume",
    description: "Set volume",
    category: "music",
    execute(message, args, settings, client) {
        const [volume] = args;
        client.player.setVolume(volume)
    }
};