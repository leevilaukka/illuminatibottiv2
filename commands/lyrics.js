const { getSong, getLyrics } = require("genius-lyrics-api");
const argsToString = require("../helpers/argsToString");
module.exports = {
    name: "lyrics",
    description: "Search Genius for lyrics",
    execute(message, args, settings, client) {
        const [artist, ...title] = args;

        const options = {
            apiKey: process.env.GENIUSKEY,
            title: argsToString(title) || artist,
            artist,
            optimizeQuery: true,
        };

        getLyrics(options).then((lyrics) => {
            console.log(lyrics);
            getSong(options).then((song) => {
                if(!song) return message.reply("kappaletta ei löytynyt!")
                console.log("Song:", song);
                const embed = {
                    title: "Lyriikkasi!",
                    thumbnail: {
                        url: song.albumArt,
                    },
                    description: lyrics,
                };

                message.channel.send({ embed });
            });
        });
    },
};
