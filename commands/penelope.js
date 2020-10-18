module.exports = {
    name: "penelope",
    description: "Laita Penelope soimaa!!",
    aliases: ["laitapenelopesoimaa"],
    cooldown: 7,
    category: "music",
    execute(message, args, settings, client) {
        client.play(message, "https://www.youtube.com/watch?v=1V60dbu-Qyw", true)
        message.reply("no laitetaa!")
    }
}
