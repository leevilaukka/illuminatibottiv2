const axios = require("axios");
const {argsToString, umlautRemover} = require("../helpers");


/*
* TODO: Queues and queuesaving to database, also save queues as playlists if possible
* BS: Possible database structure (guilds document):
*   (other fields...)
*   queue: [{
*       title: "Song Title",
*       url: youtube url
*   }]
*   playlists: [ObjectIDs pointing to playlist document with saved queues]
* */

module.exports = {
    name: "youtube",
    description: "Youtube juttu",
    aliases: ['yt'],
    args: true,
    usage: '<hakutermi>',
    category: "music",
    execute(message, args, settings, client) {
        // Google API token
        const token = process.env.GOOGLE_API;

        // Convert args array to string
        const search = umlautRemover(argsToString(args));

        // Dynamically Axios GET Google API with given search arguments
        axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${token}&type=video&topicId=/m/04rlf`, {
            headers: {
                "Accept": "application/json"
            }
        }).then(async res => {
            // Init video data variables
            const video = res.data.items[0];
            const url = `https://www.youtube.com/watch?v=${video.id.videoId}`;

            // Init embed object
            const embed = {
                embed: {
                    title: video.snippet.title,
                    description: video.snippet.description,
                    url,
                    color: 0xFF0000,
                    image: {
                        url: video.snippet.thumbnails.high.url
                    },
                    author: {
                        name: video.snippet.channelTitle,
                        url: `https://www.youtube.com/channel/${video.snippet.channelId}`
                    },
                    timestamp: video.snippet.publishedAt,
                    footer: {
                        icon_url: "https://w1.pngwave.com/png/435/976/46/app-icon-logo-icon-media-icon-popular-icon-social-icon-youtube-icon-red-line-sign-circle-png-clip-art.png",
                        text: "Youtube x IlluminatiBotti",
                    }
                }
            };
            // Send embed

            message.channel.send("Tässä hakemasi video!", embed).catch(e => console.error(e));
            await client.play(message, url);
        })
            .catch(e => {
                console.error(e);
                message.channel.send(`Videota ei löytynyt. Tapahtui virhe ${e.message}`)
            })
    }
};