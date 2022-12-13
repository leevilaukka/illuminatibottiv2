import { Track } from "discord-player";
import { Colors, EmbedBuilder } from "discord.js";
import { IlluminatiEmbed } from "../../structures";
import { BotError } from "../../structures/Errors";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue, track: Track ) => {
    if(!track) {
        throw new BotError('No track playing.')
    }
    const embed = new IlluminatiEmbed(queue.metadata.message, client)
        .setTitle('Track Started')
        .setDescription(track.title)
        .setThumbnail(track.thumbnail)
        .setFooter({
            text: `Requested by ${track.requestedBy.username}`
        })
        .setTimestamp()
        .setColor(Colors.Blurple)
        
    return queue.metadata.channel.send({embeds: [embed]})
}

export default evt