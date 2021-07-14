import moment from "moment";
import axios from "axios";

import { IlluminatiEmbed } from "../../structures";

import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: "name",
    aliases: ["nimi", "nimipäivä"],
    description: "Päivän nimipäiväsankarit",
    category: "date",
    execute(message, args, client) {
        const date = moment().format("YYYY-MM-DD");
        axios.get("http://www.webcal.fi/cal.php?id=4&format=json&start_year=current_year&end_year=current_year&tz=Europe%2FHelsinki")
            .then(res => {
                const names = res.data;
                for (let i = 0; i < names.length; i++) {
                    if (names[i].date === date) {
                        const results = [names[i]];
                        new IlluminatiEmbed(message, {
                            title: "Päivän nimipäivät",
                            url: results[0].url,
                            description: results[0].name,
                            fields: [
                                {
                                    name: "Päivämäärä",
                                    value: moment(results[0].date).format("DD.MM.YYYY")
                                }
                            ]
                        }, client).send();
                    }
                }
        })
    }
};

export default command