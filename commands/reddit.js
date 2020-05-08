const axios = require("axios");
module.exports = {
    name: 'reddit',
    aliases: ['r', 'r/'],
    cooldown: 10,
    description: 'Lähettää annetusta subredditistä satunnaisen postauksen',
    execute(message, args) {
        // Command arguments
        let subreddit = args[0];
        let skipnsfw = args[1];

        // Subreddit argument given check
        if (!subreddit){
            return message.channel.send("Anna subreddit!")
                .catch(e => message.channel.send(e))
        }

        // Dynamically get random reddit post from given subreddit
        axios.get(`https://www.reddit.com/r/${subreddit}/random.json`)
            .then(res => {
                // Subreddit found check
                if (!res.data[0]) {
                    return message.channel.send("Subreddittiä ei löytynyt!");
                }

                // Assing response data to variables
                let title = res.data[0].data.children[0].data.title;
                let kuva = res.data[0].data.children[0].data.url;
                let url = "https://www.reddit.com" + res.data[0].data.children[0].data.permalink;
                let name = res.data[0].data.children[0].data.author;
                let postaajaurl = "https://www.reddit.com/user/" + name;
                let nsfw = res.data[0].data.children[0].data.over_18;


                //Skip NSFW check
                if (skipnsfw !== "-s") {
                    // NSFW check
                    if (!message.channel.nsfw && nsfw) {
                        return message.channel.send("En voi lähettää tätä sisältöä kuin NSFW-kanaville!");
                    }
                }

                // Embed data init
                let data = {
                    embed: {
                        title,
                        url,
                        description: nsfw ? "**NSFW**" : null,
                        color: 0xff4500,
                        footer: {
                            icon_url: "https://i.redd.it/qupjfpl4gvoy.jpg",
                            text: "IlluminatiBotti x Reddit"
                        },
                        image: {
                            url: kuva
                        },
                        author: {
                            name,
                            url: postaajaurl
                        }
                    }
                };

                // Send embed
                message.channel.send(data)
                    .then(e => console.log(
                        "Näytettiin satunnainen postaus osoitteesta http://www.reddit.com/r/" + subreddit
                    ))
                    // Catch errors with send and log
                    .catch(e => console.error(e));
                // Catch error with Axios GET
            }).catch(e => {
            // Send error response to channel
            if (e.response) {
                message.channel.send(`Tapahtui virhe: ${e.response.status} - ${e.response.statusText}`);
            }
            // Console log error
            console.error(e);
        });
    }
};