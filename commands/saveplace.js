const mongoose = require('mongoose')
const Guild = require('../models/Guild')

module.exports = {
    name: 'saveplace',
    description: 'Tallenna paikkoja koordinaattien mukaan!',
    category: "maps",
    cooldown: 5,
    args: true,
    execute(message, args, settings, client) {
       const [name, lat, lon, ...rest] = args;
       const newSettings = {
           name,
           coords: {
               lat,
               lon
           }
       }
       Guild.findOneAndUpdate({guildID: message.guild.id}, {
           $push: {places: newSettings}
       })
           .catch(e => console.error(e))
    }
}
