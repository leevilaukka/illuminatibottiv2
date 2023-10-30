import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "stop",
    description: "Stop the music",
    guildOnly: true,
    category: Categories.music,
    run(message, args, settings, client, { queue }) {
        if (queue.metadata.queueHidden) {
            return message.channel.send("Musiikkivisa on käynnissä, joten et voi pysäyttää musiikkia!");
        }
        
        if (queue) {
            queue.node.stop();
            return message.reply("Musiikki pysäytetty!");
        }
    },
};
export default command;
