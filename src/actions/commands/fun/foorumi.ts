import { IlluminatiEmbed } from "../../../structures";
import Command from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "foorumi",
    description: "DiscordFoorumi-linkki",
    category: "other",
    execute(message, args, settings, client) {
        new IlluminatiEmbed(message, {
            title: "DiscordFoorumi",
            url: "https://foorumi.leevila.fi",
            description: "Käy chekkaa DiscordFoorumi",
            author: {
                name: "IlluminatiBotti",
                icon_url: client.user.displayAvatarURL() || "https://cdn.discordapp.com/embed/avatars/0.png"
            }
        }, client).send()
    }
};

export default command