import { UserError } from "../../../structures/Errors";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
enum queueModes {
    "Pois",
    "Kappale",
    "Jono",
    "AutoPlay",
}

const command: Command = {
    name: "loop",
    description: "Vaihda toistimen toistotilaa",
    aliases: ["l"],
    category: Categories.music,
    guildOnly: true,
    run(message, args, settings, client, { queue }) {
        const loopMode = queue.repeatMode;

        if (queue && loopMode < 3) {
            queue.setRepeatMode(loopMode + 1);
        } else if (!queue) {
            throw new UserError("Ei jonoa mitä toistaa");
        } else {
            queue.setRepeatMode(0);
        }

        return message.reply(
            `Toistotila asetettu tilaan \`${queueModes[queue.repeatMode]}\``
        );
    },
};
export default command;
