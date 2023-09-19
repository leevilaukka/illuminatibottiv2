import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "rng",
    description: "Random Number Generator",
     usage: "<min> <max>",
    category: Categories.math,
    cooldown: 0,
    async run(message, args, client, settings) {
        const [min, max] = args.map(parseInt);
        let random = 0;

        if (min && max) {
            random =
                Math.floor(
                    Math.random() * (max - min + 1)
                ) + min;
        } else {
            random = Math.floor(Math.random() * 10);
        }

        message.reply(`satunnaislukusi on ${random}`);
    },
};

export default command;
