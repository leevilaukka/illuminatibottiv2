import { Track } from "discord-player";
import { Colors } from "discord.js";
import { IlluminatiEmbed } from "../../structures";
import { BotError } from "../../structures/Errors";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = async (client, queue, track: Track) => {
    if (!track) {
        throw new BotError("No track playing.");
    }

    if (!queue.metadata) {
        throw new BotError("No metadata found.");
    }

    if (!queue.metadata.channel) {
        throw new BotError("No channel found.");
    }

    if (queue.metadata.fromAPI) {
        return;
    }

    const embed = new IlluminatiEmbed(queue.metadata.message, client)
        .setTitle("Track Started")
        .setDescription(track.title)
        .setThumbnail(track.thumbnail)
        .setFooter({
            text: `Requested by ${track.requestedBy.username}`,
        })
        .setTimestamp()
        .setFields([
            {
                name: "Web GUI",
                value: `[Link](${client.getPlayerLink(
                    queue.metadata.message.guild.id
                )})`,
            },
        ])
        .setColor(Colors.Blurple);

    return queue.metadata.channel.send({ embeds: [embed] });
};

export default evt;
