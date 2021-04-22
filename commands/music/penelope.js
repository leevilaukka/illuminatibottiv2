module.exports = {
    name: "penelope",
    description: "Laita Penelope soimaa!!",
    aliases: ["laita-penelope-soimaa", "pistä-penelope-soimaa"],
    cooldown: 7,
    category: "music",
    execute(message, args, settings, client) {
        message.reply("no laitetaa!");
        client.player.play(
            "https://www.youtube.com/watch?v=1V60dbu-Qyw",
            message
        );
    },
};
