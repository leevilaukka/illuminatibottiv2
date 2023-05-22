import { UserError } from "../../../structures/Errors";
import { argsToString } from "../../../helpers";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
import { PlayerMetadata } from "../../../types/PlayerMetadata";

// TODO optimize
const command: Command = {
    name: "play",
    aliases: ["p"],
    description: "Plays a song",
    category: Categories.music,
    guildOnly: true,
    async run(message, args, _settings, client, _meta) {
        if (!message.member.voice.channelId) {
            throw new UserError("Et ole puhekanavalla!");
        }

        const metadata: PlayerMetadata = {
            channel: message.channel,
            message,
            author: message.author,
            command: this,
        };

        const query = argsToString(args);

        if (!query) {
            throw new UserError("Anna kappaleen nimi tai URL");
        }

        client.isDevelopment &&
            console.log(`[Player] Playing ${query} on ${message.guildId}`);

        client.player.play(message.member.voice.channel, query, {
            searchEngine: "auto",
            requestedBy: message.author,
            nodeOptions: {
                metadata,
            },
        });
    },
};
export default command;
