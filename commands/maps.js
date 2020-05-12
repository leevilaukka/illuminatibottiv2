const umlautFix = require("../helpers/umlautRemover");

const Discord = require("discord.js");
const axios = require("axios");
const fs = require("fs");

module.exports = {
    name: "maps",
    description: "Google Maps- integraatio",
    execute(message, args) {
        const regex = /,/gi;

        const locationRegex = args.toString().toLowerCase().replace(regex, " ");
        const location = umlautFix.function(locationRegex);
        const token = process.env.GOOGLE_API;
        const path = './pipes/maps.png';
        const writer = fs.createWriteStream(path);
        axios.get(`https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=15&size=640x640&maptype=roadmap&key=${token}&scale=2`, {
            responseType: "stream"
        })
            .then(res => {
                res.data.pipe(writer);

                writer.on('finish', resolve => {
                    const file = new Discord.MessageAttachment('./pipes/maps.png');

                    let embed = {
                        title: `Karttasi!`,
                        image: {
                            url: 'attachment://maps.png'
                        }
                    };

                    message.channel.send({files: [file], embed});
                })

            })
            .catch(e => console.error(e))
    }
};