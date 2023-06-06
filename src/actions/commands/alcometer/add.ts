import Alcometer from "../../../models/Alcometer";
import { Command } from "../../../types";

const command: Command = {
    name: "adddrink",
    aliases: ["ad"],
    description: "Add a drink to your alcometer",
    usage: "<volume in cents> <percentage>",

    async run(message, args, settings, client, { user, guild }) {
        const [volume, percentage, name] = args;
        const alcometer = await user.alcometer();

        console.log(alcometer);

        if (!alcometer.hasMeter()) {
            return message.channel.send(
                "You don't have an alcometer. Start one with `start`"
            );
        }

        if (!volume || !percentage) {
            return message.channel.send(
                "Please provide a volume and percentage"
            );
        }

        const vol = parseInt(volume);
        const perc = parseFloat(percentage);

        if (isNaN(vol) || isNaN(perc)) {
            return message.channel.send(
                "Please provide a valid volume and percentage"
            );
        }

        const alcInGrams = 0.079 * vol * perc;

        await alcometer.addDrink({
            name: name || "Unknown",
            volume: vol,
            percentage: perc,
            alcInGrams: alcInGrams,
            time: new Date(),
        });

        message.channel.send(
            `Added ${vol}ml of ${perc}% ${name || ""} to your alcometer`
        );
    },
};

export default command;
