import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";

const command: Command = {
    name: "player",
    async run(message, args, settings, client, meta) {
        const link = await client.getPlayerLink(message.guildId)

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
