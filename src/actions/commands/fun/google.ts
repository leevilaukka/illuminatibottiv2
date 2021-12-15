import { argsToString } from "../../../helpers";
import { IlluminatiEmbed } from "../../../structures";
import Command from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "google",
    aliases: ["hae", "g", "gs"],
    description: "Hae Googlen Knowledge Graphista",
    usage: "<hakusana>",
    category: "other",
    execute(message, args, settings, client) {
        const query = argsToString(args);
        client.axios.get(`https://kgsearch.googleapis.com/v1/entities:search?query=${query}&languages=fi&key=${process.env.GOOGLE_API}`)
            .then(res => {
                if (!res.data.itemListElement[0]) {
                    return message.channel.send("Hakusanalla ei löytynyt kohteita :cry:")
                }
                const result = res.data.itemListElement[0].result;

                let fields = [];

                if (result.url) {
                    fields.push({
                        name: "Nettisivut",
                        value: result.url
                    })
                }
                
                if (result.detailedDescription) {
                    fields.push({
                        name: "Tarkempi kuvaus",
                        value: result.detailedDescription.articleBody
                    })
                }

                new IlluminatiEmbed(message, client, {
                    title: result.name,
                    url: result.detailedDescription && result.detailedDescription.url ,
                    description: result.description,
                    color: 0x22ff22,
                    fields,
                    image: {
                        url: result.image && result.image.contentUrl
                    },
                    footer: {
                        text: "IlluminatiBotti x Google"
                    }
                }).send();
            })
            .catch(e => {
                console.error(e);
                message.channel.send(`Tapahtui virhe! - ${e.message}`)
            })
    }
};

export default command