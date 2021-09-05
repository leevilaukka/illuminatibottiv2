import algebra from "algebra.js";
import { argsToString }  from "../../../helpers";
import { IlluminatiEmbed } from "../../../structures";

import Command from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "math",
    description: "Matikkaaa!",
    args: true,
    category: "math",
    execute(message, args, client, settings) {

        if (!args.includes("x")) {
            args.unshift("x", "=")
        }

        try {
            const exp: any = algebra.parse(argsToString(args));
            const ansX = exp.solveFor("x");

            const image = `http://chart.apis.google.com/chart?cht=tx&chl=${encodeURIComponent(argsToString(args))}`;
            let fields = [
                {
                    name: "Lasku",
                    value: argsToString(args)
                },
                {
                    name: "X",
                    value: ansX
                }
            ];
            if (args.includes("y")) {
                const ansY = exp.solveFor("y");
                fields.push({
                    name: "Y",
                    value: ansY
                })
            }
            new IlluminatiEmbed(message, client, {
                title: "Vastaus",
                image: {
                    url: image
                },
                fields,
            }).send();
        } catch (e) {
            return message.channel.send(e.message);
        }
    }
};

export default command