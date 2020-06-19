const algebra = require("algebra.js");
const {argsToString} = require("../helpers");

module.exports = {
    name: "math",
    description: "Matikkaaa!",
    args: true,
    execute(message, args) {

        if(!args.includes("x")){
            args.unshift("x", "=")
        }

        try{
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
            const embed = {
                name: "Vastaus",
                image: {
                    url: image
                },
                fields,
            };
            if(args.includes("y")){
                const ansY = exp.solveFor("y");
                fields.push({
                    name: "Y",
                    value: ansY
                })
            }
            message.channel.send({embed})
        }catch (e) {
            return message.channel.send(e.message);
        }
    }
};