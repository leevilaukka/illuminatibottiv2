import { QueueRepeatMode } from "discord-player";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "skip",
    description: "Skip the current song",
    aliases: ["s"],
    category: Categories.music,
    guildOnly: true,
    async run(message, args, settings, client) {
        const queue = client.player.nodes.get(message.guild);

        if (queue.repeatMode === QueueRepeatMode.TRACK) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            queue.node.skip();
            queue.setRepeatMode(QueueRepeatMode.TRACK);
        } else queue.node.skip();
    },
};
export default command;
