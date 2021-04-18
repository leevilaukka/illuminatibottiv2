module.exports = {
    name: "stop",
    description: "",
    category: "music",
    execute(message, args, settings, client) {
        client.player.stop();
    }
};