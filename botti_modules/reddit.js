// redditmoduuli
axios = require('axios');
module.exports = {
    sendpost: function(message, bot, axios, subreddit) {
        axios.get(`https://www.reddit.com/r/${subreddit}/random.json`)
            .then(res => {
                let title = res.data[0].data.children[0].data.title;
                let kuva = res.data[0].data.children[0].data.url;
                let url = "https://www.reddit.com" + res.data[0].data.children[0].data.permalink;
                let name = res.data[0].data.children[0].data.author;
                // let created = res.data[0].data.children[0].data.created;
                let postaajaurl = "https://www.reddit.com/user/" + name;
                let nsfw = res.data[0].data.children[0].data.over_18;
                let error = res.data.error;
                let data;

                if(error) {
                    data = "Tapahtui virhe:" + error
                }
                else {
                    data = {
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
                }
                }
                message.channel.send(data)
                    .then(e => console.log(
                        "Näytettiin satunnainen postaus osoitteesta http://www.reddit.com/r/" + subreddit
                    ))
                    .catch(e => message.channel.send(e));
            });
    }
};