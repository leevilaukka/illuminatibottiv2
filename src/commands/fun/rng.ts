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
        let random = 0
        // Random Number Generator from min to max
        if (min && max) {
            random = Math.floor(Math.random() * (max - min + 1)) + min;
        } else {
            random = Math.floor(Math.random() * 10);
        }
    
        sender.reply(
            `satunnaislukusi on ${random}`
        )
    }
}

export default command