import Command, { Categories } from '../../../types/IlluminatiCommand'

import Guild from '../../../models/Guild';

const command: Command = {
    name: 'saveplace',
    description: 'Tallenna paikkoja koordinaattien mukaan!',
    category: Categories.maps,
    cooldown: 5,
    args: true,
    run(message, args, settings, client) {
        const [name, lat, lon, ...rest] = args;
        const description = rest.join(' ');

        const newSettings = {
            type: "Point",
            coordinates: [lon, lat]
        }

        if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
            return message.reply("koordinaattien tulee olla numeroita esim 123.45")
        }

        Guild.findOneAndUpdate({ guildID: message.guild.id }, {
            $push: {
                places: {
                    name,
                    location: newSettings,
                    description
                }
            }
        })
            .catch(e => console.error(e))
    }
}

export default command;