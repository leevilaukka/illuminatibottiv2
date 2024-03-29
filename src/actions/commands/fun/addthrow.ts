import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

import Guild from "../../../models/Guild";
import { Errors } from "../../../structures";    


const command: Command = {
    name: "addthrow",
    aliases: ["lisääthrow", "addheitto", "lisääheitto"],
    description: "Lisää heitto :D",
    category: Categories.general,
    cooldown: 10,
    args: true,
    usage: "<kuvan url (.png | .jpg | .gif)>",
    run(message, args, settings, client) {
        const [heitto, ...rest] = args;

        if ([".jpg", ".png", ".gif"].some((suffix) => heitto.endsWith(suffix))) {
            Guild.findOneAndUpdate(
                { guildID: message.guild.id },
                {
                    $push: { throws: heitto },
                }
            ).catch((e: any) => {
                throw new Errors.DatabaseError(e);
            });
        } else return message.reply("anna png, jpg tai gif päätteinen osoite!");
    },
};

export default command;
