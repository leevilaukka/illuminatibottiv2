import axios from "axios";
import { toTimestamp } from "../../utils";
import { IlluminatiEmbed } from "../../structures";
import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: "reddit",
    aliases: ["r", "r/"],
    description: "Lähettää annetusta subredditistä satunnaisen postauksen",
    category: "other",
    enableSlash: false,
    guildOnly: true,
    args: true,
    argTypes: ["string", "string"],
    options: [
        {
            name: "subreddit" ,
            description: "Name of subreddit",
            type: "STRING",
            required: true
        },
        {
            name: "skip",
            description: "Skip NSFW channel test",
            type: "STRING"
        }
    ],
    execute(message: any, args, settings, client, interaction) {
        const sender = message || interaction;

        // Command arguments
        let subreddit = args[0];
        let skipnsfw = args[1];

        // Subreddit argument given check
        if (!subreddit) {
            return message.channel
                .send("Anna subreddit!")
                .catch((e: any) => message.channel.send(e));
        }

        // Dynamically get random reddit post from given subreddit
        axios
            .get(`https://www.reddit.com/r/${subreddit}/random.json`)
            .then((res) => {
                console.log(res)
                // Subreddit found check
                if (!res.data[0]) {
                    return sender.reply("Subreddittiä ei löytynyt!");
                }

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
                    if (!interaction && !message.channel.nsfw && nsfw ) {
                        return sender.reply(
                            "En voi lähettää tätä sisältöä kuin NSFW-kanaville!"
                        );
                    }
                }

                // Embed data init
                let fields = [
                    {
                        name: "Lähettäjä", 
                        value: `[${name}](${postaajaurl})`,
                        inline: true
                    },
                    {
                        name: "Subreddit",
                        value: `[${subreddit}](${subURL})`,
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
                console.log(created)
                const embed = new IlluminatiEmbed(message || interaction, {
                        title,
                        url,
                        description: nsfw ? "**NSFW**" : null,
                        color: flaircolor ? `0x${flaircolor}` : 0xff4500,
                        image: {
                            url: kuva,
                        },
                        author: {
                            name,
                            url: postaajaurl,
                        },
                        fields,
                }, client);
                
                sender.reply({embed})
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
                console.error(e);
            });
    },
};

export default command
