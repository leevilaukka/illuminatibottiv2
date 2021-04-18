module.exports = {
    name: "resume",
    description: "",
    category: "music",
    execute(message, args, settings, client) {
        client.player.resume();
    }
};