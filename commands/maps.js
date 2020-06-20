const umlautFix = require("../helpers/umlautRemover");
const argsToString = require("../helpers/argsToString");

const Discord = require("discord.js");
const axios = require("axios");
const fs = require("fs");

module.exports = {
    name: "maps",
    description: "Google Maps- integraatio",
    aliases: ["kartta"],
    usage: "<paikka>",
    category: "maps",
    execute(message, args) {
        // Init variables
        const location = umlautFix(argsToString(args));
        const token = process.env.GOOGLE_API;

        // Fs writestream path and writer
        const path = './pipes/maps.png';
        const writer = fs.createWriteStream(path);

        // Axios GET Google Maps Static API
        axios.get(`https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=15&size=640x640&maptype=roadmap&key=${token}&scale=2`, {
            responseType: "stream"
        })
            .then(res => {
                // Pipe response to writer
                res.data.pipe(writer);

                // When writer done, init new Embed with file from pipe
                writer.on('finish', resolve => {
                    const file = new Discord.MessageAttachment('./pipes/maps.png');

                    let embed = {
                        title: `Karttasi!`,
                        image: {
                            url: 'attachment://maps.png'
                        },
                        footer: {
                            text: "Google Maps x IlluminatiBotti",
                            icon_url: "https://cdn.vox-cdn.com/thumbor/pOMbzDvdEWS8NIeUuhxp23wi_cU=/1400x1400/filters:format(png)/cdn.vox-cdn.com/uploads/chorus_asset/file/19700731/googlemaps.png"
                        },
                        timestamp: Date.now()
                    };
                    // Send embed
                    message.channel.send({files: [file], embed});
                })

            })
            // Catch errors
            .catch(e => console.error(e))
    }
};