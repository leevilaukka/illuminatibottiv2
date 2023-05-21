import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";

const command: Command = {
    name: "player",
    run(message, args, settings, client, meta) {
        return new IlluminatiEmbed(message, client, {
            title: "Player Web GUI",
            description: "Click the link below to open the player web GUI.",
            fields: [
                {
                    name: "Link",
                    value: `[Click here](${client.getPlayerLink(
                        message.guildId
                    )})`,
                },
            ],
        }).reply();
    },
};

export default command;
