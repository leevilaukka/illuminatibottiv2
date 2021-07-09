import Command from "../../types/IlluminatiCommand";

import Guild from "../../models/Guild"

const command: Command = {
    name: 'addthrow',
    aliases: ["lisääthrow", "addheitto", "lisääheitto"],
    description: 'Lisää heitto :D',
    category: "general",
    cooldown: 10,
    args: true,
    usage: '<kuvan url (.png | .jpg | .gif)>',
    execute(message, args: string[], settings, client) {
        const [heitto, ...rest] = args;

        if (heitto.endsWith(".png") || heitto.endsWith(".jpg") || heitto.endsWith(".gif")){
            Guild.findOneAndUpdate({guildID: message.guild.id}, {
                $push: {throws: heitto}
            })
                .catch((e: any) => console.error(e))
        } else return message.reply("anna png, jpg tai gif päätteinen osoite!")
    }
}

export default command