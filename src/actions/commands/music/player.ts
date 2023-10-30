import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";

const command: Command = {
    name: "player", 
    description: "Player web GUI",
    category: "music",
    async run(message, args, settings, client, {guild, queue}) {
        if (queue.metadata.queueHidden) {
            return
        }

        const link = guild.playerLink;

        return new IlluminatiEmbed(message, client, {
            title: "Player Web GUI",
            description: "Click the link below to open the player web GUI.",
            fields: [
                {
                    name: "Link",
                    value: `[Click here](${link})`,
                },
            ],
        }).reply();
    },
};

export default command;
