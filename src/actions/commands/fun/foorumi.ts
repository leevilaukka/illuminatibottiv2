import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
const command: Command = {
    name: "foorumi",
    description: "DiscordFoorumi-linkki",
    category: Categories.other,
    async run(message, args, settings, client) {
        new IlluminatiEmbed(message, client, {
            title: "DiscordFoorumi",
            url: "https://foorumi.leevila.fi",
            description: "Käy chekkaa DiscordFoorumi",
            author: {
                name: "IlluminatiBotti",
                icon_url:
                    client.user.displayAvatarURL() ||
                    "https://cdn.discordapp.com/embed/avatars/0.png",
            },
        }).send();
    },
};

export default command;
