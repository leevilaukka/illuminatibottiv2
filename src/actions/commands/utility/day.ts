import moment from "moment";

import { IlluminatiEmbed } from "../../../structures";

import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
const command: Command = {
    name: "day",
    description: "Päivän kalenteritiedot",
    aliases: ["päivä", "kalenteri"],
    category: Categories.date,
    async run(message, args, _settings, client) {
        const date = moment().format("YYYY-MM-DD");

        client.axios
            .get(
                "http://www.webcal.fi/cal.php?id=3&format=json&start_year=current_year&end_year=current_year&tz=Europe%2FHelsinki"
            )
            .then((res) => {
                const holidays = res.data;
                for (let i = 0; i < holidays.length; i++) {
                    if (holidays[i].date === date) {
                        const results = [holidays[i]];

                        results.map((result) => {
                            const parsedDate = moment(result.date).format(
                                "DD.MM.YYYY"
                            );

                            const fields = [
                                {
                                    name: "Päivämäärä",
                                    value: parsedDate,
                                },
                            ];

                            if (result.alternate_names) {
                                fields.push({
                                    name: "Muut nimet",
                                    value: result.alternate_names,
                                });
                            }

                            if (result.age) {
                                fields.push({
                                    name: "Vietetty",
                                    value: `${result.age} vuotta`,
                                });
                            }

                            if (result.flag_day === 1) {
                                fields.push({
                                    name: "Liputuspäivä",
                                    value: ":flag_fi:",
                                });
                            }

                            new IlluminatiEmbed(message, client, {
                                title: result.name,
                                url: result.url,
                                description: result.description
                                    ? result.description
                                    : null,
                                fields,
                            }).send();
                        });
                    }
                }
            });
    },
};

export default command;
