module.exports = {
    name: "stop",
    description: "Stop playback",
    category: "music",
    execute(message, args, settings, client) {
        client.player.stop();
    }
};