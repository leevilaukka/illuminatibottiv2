module.exports = {
    name: "volume",
    description: "",
    category: "music",
    execute(message, args, settings, client) {
        let volume = args[0];
        client.player.setVolume(volume)
    }
};