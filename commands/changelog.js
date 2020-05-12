const axios = require("axios");

module.exports = {
    name: "changelog",
    aliases: ["muutokset", "update"],
    description: "Näyttää botin GitHub-repon edellisen tai määritetyn commitin viestin, ajan ja tekijän",
    usage:"[päivityksen numero -- 0 = uusin]",
    execute(message, args) {
        let update = args[0];
        if (!update) {
            update = 0;
        }
        axios.get('https://api.github.com/repos/leevilaukka/illuminatibottiv2/commits')
            .then(res => {

                const commit = res.data[update].commit;
                const committer = res.data[update].committer;
                let embed = {
                    embed: {
                        title: "IlluminatiBotti v2",
                        url: res.data[update].html_url,
                        description: commit.message,
                        author: {
                            name: commit.author.name,
                            url: committer.html_url
                        },
                        footer: {
                            icon_url: committer.avatar_url,
                            text: res.data[update].author.login
                        },
                        timestamp: commit.author.date
                    }
                };

                message.channel.send(embed)
            })
            .catch(() => message.channel.send(`Tapahtui virhe. Päivitystä ei välttämättä ole vielä olemassa.`))
    }
};