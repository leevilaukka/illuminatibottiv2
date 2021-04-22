const convert = require("convert-units");
const {argsToString, valueParser} = require("../../helpers");
const IlluminatiEmbed = require("../../structures/IlluminatiEmbed");

module.exports = {
    name: "convert",
    description: "Muunna yksiköitä. Saadaksesi tietoa saatavilla olevista yksiköistä, aja komento ilman argumentteja.",
    usage: "<määrä {alkuperäinen yksikkö} {uusi yksikkö}>",
    aliases: ["c", "muunna"],
    category: "math",
    execute(message, args, _settings, client) {
        let result;
        if (!args.length) {
            const measures = convert().measures();
            let fields = [
                {
                    name: "Yksiköt",
                    value: "Käytössä olevat yksiköt jaettuna tyypin mukaan"
                },
            ];
            const measuresToFields = (item) => {
                fields.push({
                    name: `${valueParser(item)}`,
                    value: convert().possibilities(item),
                    inline: true
                })
            };
            measures.forEach(measuresToFields);
            return new IlluminatiEmbed(message, {
                title: "Yksikkömuunnin",
                description: "Tietoja yksikkömuuntimesta",
                fields
            }, client).send()
        }

        const [value, from, to] = args;

        if (value === "info") {

            try {
                const info = convert().describe(from);

                return new IlluminatiEmbed(message, {
                    title: "Tietoa yksiköstä",
                    description: "Tietoja antamastasi yksiköstä",
                    fields: [
                        {
                            name: "Lyhenne",
                            value: info.abbr
                        },
                        {
                            name: "Tyyppi",
                            value: valueParser(info.measure)
                        },
                        {
                            name: "Järjestelmä",
                            value: valueParser(info.system)
                        }
                    ]
                }, client).send()
            } catch (e) {
                return message.channel.send(e.message);
            }


        }
        if (!to) {
            try {
                result = convert(value).from(from).toBest();
            } catch (e) {
                return message.channel.send(e.message);
            }

            const fieldValue = `${result.val} ${result.unit}`;
            return new IlluminatiEmbed(message, {
                
                    title: "Muunnos",
                    description: "Annettu lukusi muutettiin parhaaseen mahdolliseen muotoon",
                    fields: [
                        {
                            name: "Muutettava",
                            value: argsToString(args)
                        },
                        {
                            name: "Tulos",
                            value: fieldValue
                        }
                    ]
            }, client).send();
        }

        try {
            result = convert(value).from(from).to(to);
        } catch (e) {
            return message.channel.send(e.message);
        }

        new IlluminatiEmbed(message, {
            title: "Muunnos",
            description: "Annettu lukusi muutettiin haluaamasi muotoon",
            fields: [
                {
                    name: "Muutettava",
                    value: `${value} ${from} muotoon ${to}`
                },
                {
                    name: "Tulos",
                    value: `${result} ${to}`
                }
            ]
        }, client).send();
    }
};