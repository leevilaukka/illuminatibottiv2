import Command from "../../types/IlluminatiCommand";

import Guild from '../../models/Guild';

const command: Command = {
    name: 'saveplace',
    description: 'Tallenna paikkoja koordinaattien mukaan!',
    category: "maps",
    cooldown: 5,
    args: true,
    execute(message, args: number[], settings, client) {
       const [name, lat, lon, ...rest] = args;
       const newSettings = {
           name,
           coords: {
               lat,
               lon
           }
       }
       if (isNaN(lat) || isNaN(lon)) {
           return message.reply("koordinaattien tulee olla numeroita esim 123.45")
       }
       Guild.findOneAndUpdate({guildID: message.guild.id}, {
           $push: {places: newSettings}
       })
           .catch(e => console.error(e))
    }
}

export default command;