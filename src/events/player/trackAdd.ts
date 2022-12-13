import { Track } from "discord-player";
import { Colors, EmbedBuilder } from "discord.js";
import { IlluminatiEmbed } from "../../structures";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue, track: Track) => {
    console.log(track)
    const embed = new EmbedBuilder()
        .setTitle('Track Added')
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