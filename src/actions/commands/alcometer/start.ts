import Alcometer from "../../../models/Alcometer";
import { Command } from "../../../types";

const command: Command = {
    name: "start",
    aliases: ["sd"],
    description: "Start the alcometer",
    category: "other",
    outOfOrder: true,

    async run(message, args, settings, client, { user, guild }) {
        /*
        const alcometer = await user.alcometer();

        const [w, gender] = args as [string, "m" | "n"];

        if (alcometer.hasMeter()) {
            return message.channel.send(
                "You already have an alcometer started"
            );
        }

        const weight = parseInt(w);
        alcometer.start({ weight, gender, user: message.author });
    },
    */
    }
};

export default command;
