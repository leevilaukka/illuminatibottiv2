const axios = require("axios");

module.exports = {
    name: "youtube",
    description: "Youtube juttu",
    aliases: ['yt'],
    args: true,
    usage: '<hakutermi>',
    execute(message, args) {
        const token = process.env.GOOGLE_API;
        const regex = /,/gi;
        const search = args.toString().replace(regex, " ");
        console.log(search);
        axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${search}&key=${token}&type=video`, {
            headers: {
                "Accept": "application/json"
            }
        }).then(res => {
            const video = res.data.items[0];
            const url = `https://www.youtube.com/watch?v=${video.id.videoId}`;
            console.log(video);
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
            message.channel.send("Tässä hakemasi video!", embed);
        })
            .catch(e => console.error(e))
    }
};