const Guild = require("../../models/Guild")

module.exports = {
    name: 'addthrow',
    aliases: ["lisääthrow", "addheitto", "lisääheitto"],
    description: 'Lisää heitto :D',
    category: "general",
    cooldown: 10,
    args: true,
    usage: '<kuvan url (.png | .jpg | .gif)>',
    execute(message, args, settings, client) {
        const [heitto, ...rest] = args;

        if (heitto.endsWith(".png") || heitto.endsWith(".jpg") || heitto.endsWith(".gif")){
            Guild.findOneAndUpdate({guildID: message.guild.id}, {
                $push: {throws: heitto}
            })
                .catch(e => console.error(e))
        } else return message.reply("anna png, jpg tai gif päätteinen osoite!")
    }
}
