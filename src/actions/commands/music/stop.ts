import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "stop",
    description: "Stop the music",
    guildOnly: true,
    category: Categories.music,
    run(message, args, settings, client) {
        const queue = client.player.getQueue(message.guild);

        if (queue) {
            queue.stop();
            return message.reply("Musiikki pysäytetty!");
        }
    },
};
export default command;
