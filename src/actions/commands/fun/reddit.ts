import { toTimestamp } from "../../../utils";
import { IlluminatiEmbed } from "../../../structures";
import Command, { Categories } from '../../../types/IlluminatiCommand'
import {ColorResolvable, Message, MessageActionRow, MessageButton, TextChannel} from "discord.js";

const command: Command = {
    name: "reddit",
    aliases: ["r", "r/"],
    description: "Lähettää annetusta subredditistä satunnaisen postauksen",
    category: Categories.other,
    guildOnly: true,
    usage: "<subreddit>",
    args: true,
    async run(message: Message & { channel: TextChannel }, args, settings, client) {
        const sender = message

        // Command arguments
        let subreddit = args[0];
        let skipnsfw = args[1];

        // Subreddit argument given check
        if (!subreddit) {
            try {
                return message.channel
                    .send("Anna subreddit!");
            } catch (e) {
                return await message.channel.send(e);
            }
        }

        // Dynamically get random reddit post from given subreddit
        client.axios
            .get(`https://www.reddit.com/r/${subreddit}/random.json`)
            .then((res) => {
                // Subreddit found check
                if (!res.data[0]) return sender.reply("Subreddittiä ei löytynyt!");

                const {
                    title,
                    thumbnail: thumb, url: kuva, permalink, author: name,
                    over_18: nsfw, author_flair_text: flair,
                    link_flair_background_color: flaircolor, subreddit, created
                } = res.data[0].data.children[0].data
                const rURL = "https://www.reddit.com"
                const url = rURL + permalink;
                const subURL = rURL + `/r/${subreddit}`
                const postaajaurl = "https://www.reddit.com/u/" + name;

                //Skip NSFW check
                if (skipnsfw !== "-s") {
                    // NSFW check
                    if (!message.channel.nsfw && nsfw) {
                        return sender.reply(
                            "En voi lähettää tätä sisältöä kuin NSFW-kanaville!"
                        );
                    }
                }

                // Embed data init
                let fields = [
                    {
                        name: "Lähettäjä",
                        value: `${name}`,
                        inline: true
                    },
                    {
                        name: "Subreddit",
                        value: `${subreddit}`,
                        inline: true

                    },
                    {
                        name: "Luotu",
                        value: toTimestamp(Math.trunc(created), "md-t")
                    }
                ];

                if (flair) {
                    fields.push({
                        name: "Flair",
                        value: flair,
                        inline: false
                    });
                }

                const color = flaircolor ? `#${flaircolor}` as ColorResolvable : 0xff4500 as ColorResolvable
                const embed = new IlluminatiEmbed(message, client, {
                    title,
                    url,
                    description: nsfw ? "**NSFW**" : null,
                    color,
                    image: {
                        url: kuva,
                    },
                    author: {
                        name,
                        url: postaajaurl,
                    },
                    fields,
                });

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle("LINK")
                            .setURL(url)
                            .setLabel("Postaus"),
                        new MessageButton()
                            .setStyle("LINK")
                            .setURL(postaajaurl)
                            .setLabel("Postaaja"),
                        new MessageButton()
                            .setStyle("LINK")
                            .setURL(subURL)
                            .setLabel("Subreddit"),
                    )


                sender.reply({ embeds: [embed], components: [row] })
            })
            // Catch error with Axios GET
            .catch((e) => {
                // Send error response to channel
                if (e.response) {
                    sender.reply(
                        `Tapahtui virhe: ${e.response.status} - ${e.response.statusText}`
                    );
                }
                // Console log error
                throw new Error(e)
            });
    },
};

export default command
