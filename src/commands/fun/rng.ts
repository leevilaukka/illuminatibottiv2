import Command from "../../types/IlluminatiCommand";

const command: Command = {
    name: "rng",
    description: "Random Number Generator",
    args: true,
    usage: "<min> <max>",
    category: "math",
    cooldown: 0,
    enableSlash: false,
    options: [{
        name: "min",
        type: "INTEGER",
        description: "Minimiluku"
    },{
        name: "max",
        type: "INTEGER",
        description: "Maksimiluku"
    }],
    execute(message, args: number[], client, settings, interaction) {
        const sender = message || interaction;
        const [min, max] = args;

        const rnd = Math.floor(Math.random()*(max-min+1)+min);
        sender.reply(
            `satunnaislukusi on ${rnd}`
        )
    }
}

export default command