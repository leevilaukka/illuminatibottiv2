import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";

import _ from "lodash";

const command: Command = {
    name: "testEmbed",
    aliases: ["testembed"],
    description: "Testaa embedien luontia",
    category: "utility",
    async run(message, args, settings, client, { guild }) {
        const [ pageCount ] = args;

        const count = parseInt(pageCount) || 3;

        const mainEmbed = new IlluminatiEmbed(message, client, {
            title: "Test",
            description: "Test",
            fields: [
                {
                    name: "Test",
                    value: "Test",
                },
            ],
        });

        _.times(count, (i) => {
            const embed = new IlluminatiEmbed(message, client, {
                title: "Test",
                description: `Page ${i + 1} of ${count}`,
                fields: [
                    {
                        name: "Test",
                        value: "Test",
                    },
                ],
            });

            mainEmbed.addPage(embed);
        });

        mainEmbed.send();
    },
};

export default command;


