import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "rng",
    description: "Random Number Generator",
    args: true,
    usage: "<min> <max>",
    category: Categories.math,
    cooldown: 0,
    enableSlash: false,
    options: [
        {
            name: "min",
            type: "INTEGER",
            description: "Minimiluku",
        },
        {
            name: "max",
            type: "INTEGER",
            description: "Maksimiluku",
        },
    ],
    async run(message, args, client, settings) {
        const [min, max] = args;
        let random = 0;
        // Random Number Generator from min to max
        if (min && max) {
            random =
                Math.floor(
                    Math.random() * (parseInt(max) - parseInt(min) + 1)
                ) + parseInt(min);
        } else {
            random = Math.floor(Math.random() * 10);
        }

        message.reply(`satunnaislukusi on ${random}`);
    },
};

export default command;
