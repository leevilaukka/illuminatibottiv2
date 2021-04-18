const convert = require("convert-units");
const {argsToString, valueParser} = require("../../helpers");

module.exports = {
    name: "convert",
    description: "Muunna yksiköitä. Saadaksesi tietoa saatavilla olevista yksiköistä, aja komento ilman argumentteja.",
    usage: "<määrä {alkuperäinen yksikkö} {uusi yksikkö}>",
    aliases: ["c", "muunna"],
    category: "math",
    execute(message, args) {
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
            const embed = {
                title: "Yksikkömuunnin",
                description: "Tietoja yksikkömuuntimesta",
                fields
            };
            return message.channel.send({embed})
        }

        const [value, from, to] = args;

        if (value === "info") {

            try {
                const info = convert().describe(from);

                const embed = {
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
                };
                return message.channel.send({embed})
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
            const resEmbed = {
                embed: {
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
                }
            };
            return message.channel.send(resEmbed)
        }

        try {
            result = convert(value).from(from).to(to);
        } catch (e) {
            return message.channel.send(e.message);
        }

        const embed = {
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
        };
        message.channel.send({embed})
    }
};