import convert from "convert-units";

import { argsToString, valueParser } from "../../../helpers";
import { BotError } from "../../../structures/Errors";
import IlluminatiEmbed from "../../../structures/IlluminatiEmbed";

import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
const command: Command = {
    name: "convert",
    description:
        "Muunna yksiköitä. Saadaksesi tietoa saatavilla olevista yksiköistä, aja komento ilman argumentteja.",
    usage: "<määrä {alkuperäinen yksikkö} {uusi yksikkö}>",
    aliases: ["c", "muunna"],
    category: Categories.math,
    run(message, args: any, _settings, client) {
        let result: any;
        if (!args.length) {
            const measures = convert().measures();

            let fields = [
                {
                    name: "Yksiköt",
                    value: "Käytössä olevat yksiköt jaettuna tyypin mukaan",
                },
            ];

            const measuresToFields = (item: any) => {
                fields.push({
                    name: `${valueParser(item)}`,
                    value: convert().possibilities(item).toString(),
                });
            };

            measures.forEach(measuresToFields);
            return new IlluminatiEmbed(message, client, {
                title: "Yksikkömuunnin",
                description: "Tietoja yksikkömuuntimesta",
                fields,
            }).send();
        }

        const [value, from, to] = args;

        if (value === "info") {
            try {
                const info = convert().describe(from);

                return new IlluminatiEmbed(message, client, {
                    title: "Tietoa yksiköstä",
                    description: "Tietoja antamastasi yksiköstä",
                    fields: [
                        {
                            name: "Lyhenne",
                            value: info.abbr,
                        },
                        {
                            name: "Tyyppi",
                            value: valueParser(info.measure),
                        },
                        {
                            name: "Järjestelmä",
                            value: valueParser(info.system),
                        },
                    ],
                }).send();
            } catch (e) {
                throw new BotError(e);
            }
        }
        if (!to) {
            try {
                result = convert(value).from(from).toBest();
            } catch (e) {
                throw new BotError(e);
            }

            const fieldValue = `${result.val} ${result.unit}`;
            return new IlluminatiEmbed(message, client, {
                title: "Muunnos",
                description:
                    "Annettu lukusi muutettiin parhaaseen mahdolliseen muotoon",
                fields: [
                    {
                        name: "Muutettava",
                        value: argsToString(args),
                    },
                    {
                        name: "Tulos",
                        value: fieldValue,
                    },
                ],
            }).send();
        }

        try {
            result = convert(value).from(from).to(to);
        } catch (e) {
            throw new BotError(e);
        }

        new IlluminatiEmbed(message, client, {
            title: "Muunnos",
            description: "Annettu lukusi muutettiin haluaamasi muotoon",
            fields: [
                {
                    name: "Muutettava",
                    value: `${value} ${from} muotoon ${to}`,
                },
                {
                    name: "Tulos",
                    value: `${result} ${to}`,
                },
            ],
        }).send();
    },
};

export default command;
