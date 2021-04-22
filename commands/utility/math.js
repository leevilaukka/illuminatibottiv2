const algebra = require("algebra.js");
const {argsToString} = require("../../helpers");
const IlluminatiEmbed = require("../../structures/IlluminatiEmbed");

module.exports = {
    name: "math",
    description: "Matikkaaa!",
    args: true,
    category: "math",
    execute(message, args) {

        if (!args.includes("x")) {
            args.unshift("x", "=")
        }

        try {
            const exp = new algebra.parse(argsToString(args));
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
            new IlluminatiEmbed(message, {
                name: "Vastaus",
                image: {
                    url: image
                },
                fields,
            }, client).send();
        } catch (e) {
            return message.channel.send(e.message);
        }
    }
};