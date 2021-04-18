const { getSong, getLyrics } = require("genius-lyrics-api");
const argsToString = require("../../helpers/argsToString");
const IlluminatiEmbed = require("../../structures/IlluminatiEmbed");
module.exports = {
    name: "lyrics",
    description: "Search Genius for lyrics",
    category: "music",
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
                const embed = new IlluminatiEmbed(message.author, {
                    title: "Lyriikkasi!",
                    thumbnail: {
                        url: song.albumArt,
                    },
                    description: lyrics,
                }, client);

                message.channel.send({ embed });
            });
        });
    },
};
