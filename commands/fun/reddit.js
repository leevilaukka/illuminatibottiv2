const axios = require("axios");
const IlluminatiEmbed = require("../../structures/IlluminatiEmbed");
module.exports = {
    name: "reddit",
    aliases: ["r", "r/"],
    cooldown: 3,
    description: "Lähettää annetusta subredditistä satunnaisen postauksen",
    category: "other",
    execute(message, args, settings, client) {
        // Command arguments
        let subreddit = args[0];
        let skipnsfw = args[1];

        // Subreddit argument given check
        if (!subreddit) {
            return message.channel
                .send("Anna subreddit!")
                .catch((e) => message.channel.send(e));
        }

        // Dynamically get random reddit post from given subreddit
        axios
            .get(`https://www.reddit.com/r/${subreddit}/random.json`)
            .then((res) => {
                // Subreddit found check
                if (!res.data[0]) {
                    return message.channel.send("Subreddittiä ei löytynyt!");
                }

                const {
                    title, 
                    thumbnail: thumb, url: kuva, permalink, author: name, 
                    over_18: nsfw, author_flair_text: flair,
                    link_flair_background_color: flaircolor
                } = res.data[0].data.children[0].data
                
                const url = "https://www.reddit.com" + permalink;
                const postaajaurl = "https://www.reddit.com/user/" + name;
        
                //Skip NSFW check
                if (skipnsfw !== "-s") {
                    // NSFW check
                    if (!message.channel.nsfw && nsfw) {
                        return message.channel.send(
                            "En voi lähettää tätä sisältöä kuin NSFW-kanaville!"
                        );
                    }
                }

                // Embed data init
                let fields = [];
                if (flair) {
                    fields.push({
                        name: "Flair",
                        value: flair,
                    });
                }
            
                new IlluminatiEmbed(message, {
                        title,
                        url,
                        description: nsfw ? "**NSFW**" : null,
                        color: flaircolor ? `0x${flaircolor}` : 0xff4500,
                        footer: {
                            icon_url: "https://i.redd.it/qupjfpl4gvoy.jpg",
                            text: "IlluminatiBotti x Reddit",
                        },
                        thumbnail: {
                            url: thumb && null,
                        },
                        image: {
                            url: kuva,
                        },
                        author: {
                            name,
                            url: postaajaurl,
                        },
                        fields,
                    }, client).send();                    
            })
            // Catch error with Axios GET
            .catch((e) => {
                // Send error response to channel
                if (e.response) {
                    message.channel.send(
                        `Tapahtui virhe: ${e.response.status} - ${e.response.statusText}`
                    );
                }
                // Console log error
                console.error(e);
            });
    },
};
