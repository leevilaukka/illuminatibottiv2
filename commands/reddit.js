const reddit = require("../botti_modules/reddit");
const axios = require("axios");
module.exports = {
    name: 'reddit',
    aliases: ['r', 'r/'],
    cooldown: 10,
    description: 'Lähettää annetusta subredditistä satunnaisen postauksen',
    execute(message, args) {
        let subreddit = args[0];
        if (!subreddit){
            return message.channel.send("Anna subreddit!")
                .catch(e => message.channel.send(e))
        } else {
            return reddit.sendpost(message, message.client, axios, subreddit);
        }
    },
};