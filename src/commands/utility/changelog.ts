import axios from "axios";
import IlluminatiEmbed from "../../structures/IlluminatiEmbed";
import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: "changelog",
    aliases: ["muutokset", "update"],
    description: "Näyttää botin GitHub-repon edellisen tai määritetyn commitin viestin, ajan ja tekijän",
    usage: "<[päivityksen numero -- 0 = uusin]>",
    category: "config",
    execute(message, args, _settings, client) {
        let [update] = args;
        if (!update) {
            update = 0;
        }
        const password = process.env.GITHUB_KEY;
        const auth = {
            username: "leevilaukka",
            password
        };
        axios.get('https://api.github.com/repos/leevilaukka/illuminatibottiv2/commits', {
            auth
        })
            .then(res => {
                const {commit, committer} = res.data[update];
                new IlluminatiEmbed(message, {
                    title: "IlluminatiBotti v2",
                    url: res.data[update].html_url,
                    description: commit.message,
                    author: {
                        name: commit.author.name,
                        url: committer.html_url
                    },
                    timestamp: commit.author.date
                }, client).send();
            })
            .catch(() => message.channel.send(`Tapahtui virhe. Päivitystä ei välttämättä ole vielä olemassa.`))
    }
};

export default command;