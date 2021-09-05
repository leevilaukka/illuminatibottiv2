import fs from "fs";
import Discord, { MessageActionRow, MessageButton } from "discord.js";

import { argsToString, umlautRemover, valueParser, randomArray } from "../../../helpers";
import { IlluminatiEmbed } from "../../../structures";

import Command from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "places",
    description: "Hae paikkatietoja",
    aliases: ["paikka"],
    usage: "<hakusana>",
    cooldown: 7,
    category: "maps",
    execute(message, args, settings, client) {
        const query = umlautRemover(argsToString(args));

        // Get place id with query from Maps Places API
        client.axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${process.env.GOOGLE_API}&inputtype=textquery&locationbias=point:60.400991,25.102139&input=${query}`)
            .then(res => {
                console.log(res.data)
                // If no results, return error message
                if (!res.data.candidates[0] && res.data.status === "ZERO_RESULTS") {
                    return message.channel.send("Antamaasi paikkaa ei löytynyt :cry:")
                }
                const place_id = res.data.candidates[0].place_id;
                // Get Maps Places API Details data with place id
                client.axios.get(`https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.GOOGLE_API}&place_id=${place_id}&language=fi`)
                    .then(res => {
                        console.log(res.data)
                        // Variables for embed fields
                        const data = res.data.result;
                        const opening = data.opening_hours;
                        const photos = data.photos;

                        // Populate embed fields
                        let fields = [];

                        if (data.formatted_address) {
                            fields.push({
                                name: "Osoite",
                                value: data.formatted_address,
                                inline: true
                            })
                        }
                        //If data has a phone number, push it to fields
                        if (data.formatted_phone_number) {
                            fields.push({
                                name: "Puhelinnumero",
                                value: data.formatted_phone_number,
                                inline: true
                            })
                        }
                        //If data has a opening hours, push them to fields
                        if (opening) {
                            fields.push({
                                name: "Aukioloajat",
                                value: opening.weekday_text.join("\n"),
                                inline: false
                            })
                        }

                        //If data has a status, push it to fields
                        if (data.business_status) {
                            fields.push({
                                name: "Tila",
                                value: valueParser(data.business_status),
                                inline: false
                            })
                        }


                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setStyle("LINK")
                                    .setURL(data.url)
                                    .setLabel("Avaa kartalla"),
                                new MessageButton()
                                    .setStyle("LINK")
                                    .setDisabled(!data.website)
                                    .setURL(data.website || "https://maps.google.com")
                                    .setLabel("Nettisivut")
                            );
                        // If data has the photos array, Axios GET random photo from array
                        if (photos) {
                            const randomPhoto = randomArray(photos);
                            client.axios.get(`https://maps.googleapis.com/maps/api/place/photo?key=${process.env.GOOGLE_API}&photoreference=${randomPhoto.photo_reference}&maxwidth=600`,
                                {
                                    responseType: "stream"
                                })
                                .then(res => {
                                    // Fs writestream path and writer
                                    const path = `${__dirname}/pipes/places.png`;
                                    const writer = fs.createWriteStream(path);

                                    // Pipe photo to writer
                                    res.data.pipe(writer);
                                    writer.on("finish", resolve => {
                                        console.log(resolve)
                                        // Additional variables for new embed
                                        const file = new Discord.MessageAttachment(`${__dirname}/pipes/places.png`);

                                        // Parse photographer name from HTML tag
                                        const photographer = randomPhoto.html_attributions[0].match("(?<=>)(.+?)(?=</a>)")[0];
                                        // If photographer is found, push it to embed fields
                                        if (photographer) {
                                            fields.push({
                                                name: "Kuvan ottanut:",
                                                value: photographer,
                                                inline: false
                                            })
                                        }

                                        // Send embed with photo
                                        const embed = new IlluminatiEmbed(message, client, {
                                            title: data.name,
                                            url: data.url,
                                            color: data.icon_background_color,
                                            thumbnail: {
                                                url: data.icon,
                                                height: 5,
                                                width: 5
                                            },
                                            image: {
                                                url: 'attachment://places.png'
                                            },
                                            fields
                                        });

                                        message.channel.send({ files: [file], embeds: [embed], components: [row] })
                                    })
                                })
                                // Catch errors with getting the photo
                                .catch(e => {
                                    message.channel.send(`Tapahtui virhe :cry: - ${e.message}`)
                                });
                        } else {
                            // If no photos found, send embed without photos
                            const embed = new IlluminatiEmbed(message, client, {
                                title: data.name,
                                url: data.url,
                                image: {
                                    url: 'attachment://places.png'
                                },
                                fields
                            })


                            message.reply({ embeds: [embed], components: [row] })
                        }
                    })
                    // Catch errors getting Details data
                    .catch(e => {
                        message.channel.send(`Tapahtui virhe :cry: - ${e.message}`)
                    })
                // Catch errors getting any data
            }).catch(e => {
                message.channel.send(`Tapahtui virhe :cry: - ${e.message}`)
            })
    }
};

export default command