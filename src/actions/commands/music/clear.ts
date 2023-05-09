import { UserError } from "../../../structures/Errors";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
const command: Command = {
    name: "clear",
    category: Categories.music,
    description: "Clear the music queue",
    guildOnly: true,
    run(message, args, settings, client) {
        const queue = client.player.nodes.get(message.guild);
        if (queue && queue.tracks.data.length > 0) {
            queue.clear();
            return message.reply("Jono tyhjennetty!");
        } else {
            throw new UserError("Ei jonoa!");
        }
    },
};
export default command;
