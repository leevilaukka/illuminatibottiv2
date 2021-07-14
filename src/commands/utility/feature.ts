import axios from "axios";

import { argsToString } from "../../helpers";
import { IlluminatiEmbed } from "../../structures";

import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: "feature",
    description: "Ehdota uutta ominaisuutta tai ilmoita bugista",
    aliases: ["report", "ilmoita"],
    usage: "<{tyyppi}/numero {viesti}>",
    cooldown: 15,
    category: "general",
    execute(message, args: any, _settings, client) {
        // Array of supported types (issue labels)
        const typelist = [
            "bug", "enhancement", "invalid", "question"
        ];

        // Github API authentication object
        const password = process.env.GITHUB_KEY;
        const auth = {
            username: "leevilaukka",
            password
        };

        // Variables from arguments
        const typearg = args[0];
        let desc = argsToString(args.slice(1));

        // Check if typelist includes given type
        if (!typelist.includes(typearg)) {
            // Check if typearg is a number
            if (!isNaN(typearg) && !desc) {
                // Get Github API with issue number
                axios.get(`https://api.github.com/repos/leevilaukka/illuminatibottiv2/issues/${typearg}`, {
                    auth
                })
                    .then(res => {
                        // Create embed from returned data
                        new IlluminatiEmbed(message, {
                            title: res.data.title,
                            description: res.data.body,
                            url: res.data.html_url,
                            color: `0x${res.data.labels[0].color}`,
                            fields: [
                                {
                                    name: "Tila",
                                    value: res.data.state
                                },
                                {
                                    name: "Tägi",
                                    value: res.data.labels[0].name
                                },
                                {
                                    name: "Numero",
                                    value: res.data.number
                                }
                            ],
                            timestamp: res.data.updated_at
                        }, client).send();
                    })
                    .catch(() => message.channel.send("Ilmoitusta ei löytynyt."))
            }// If typelist doesn't include given type and typearg is not a number, send message
            else return message.channel.send(`Tuo ei ole oikeantyyppinen ilmoitus! Oikeat tyypit ovat ${typelist.toString()}. Vaihtoehtoisesti voit antaa jonkun aiemman ilmoituksen numeron tyypin sijaan saadaksesi tietoja ilmoituksesta.`)
        }

        // If desc given and type is not a number, post the data to Github API
        if (desc && isNaN(typearg)) {
            // Init data for Axios POST
            const body = desc + "\n\n > Tämä ilmoitus on lähetetty IlluminatiBotin kautta.";
            let title = body.substr(0, 10) + "..";
            const data = {
                title,
                body,
                labels: [typearg]
            };
            axios.post("https://api.github.com/repos/leevilaukka/illuminatibottiv2/issues", data, {
                auth
            })
                .then(res => {
                    // Create embed from returned data
                    new IlluminatiEmbed(message, {
                        title: "Uusi ilmoitus luotu!",
                        description: res.data.body,
                        url: res.data.html_url,
                        color: `0x${res.data.labels[0].color}`,
                        fields: [
                            {
                                name: "Tägi",
                                value: res.data.labels[0].name
                            },
                            {
                                name: "Numero",
                                value: res.data.number
                            }
                        ],
                        timestamp: Date.now()
                    }, client).send("Voit tarkistaa ilmoituksen tilan kirjoittamalla ilmoituksen numeron komennon ainoaksi argumentiksi");
                })
                .catch(e => message.channel.send("Tapahtui virhe: " + e.message))
        }
    }
};

export default command;