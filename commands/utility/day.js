const moment = require("moment");
const axios = require("axios");

module.exports = {
    name: "day",
    description: "Päivän kalenteritiedot",
    aliases: ["päivä", "kalenteri"],
    category: "date",
    execute(message, args) {
        const date = moment().format("YYYY-MM-DD");

        axios
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
                            const embed = {
                                title: result.name,
                                url: result.url,
                                description: result.description
                                    ? result.description
                                    : null,
                                fields,
                            };
                            message.channel.send({ embed });
                        });
                    }
                }
            });
    },
};