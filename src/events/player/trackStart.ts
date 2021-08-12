import { Track } from "discord-player";
import { IlluminatiClient, IlluminatiEmbed } from "../../structures";
import { PlayerQueue } from "../../types/PlayerMetadata";

export default (client: IlluminatiClient, queue: PlayerQueue, track: Track) => {
    const embed = new IlluminatiEmbed(queue.metadata.message, {
        title: `Nyt toistetaan: ${track.title}`,
        url: track.url,
        thumbnail: { url: track.thumbnail },
        fields: [
            {
                name: "Kanava",
                value: track.author
            },
            {
                name: "Kesto",
                value: track.duration
            },
            {
                name: "Näyttökerrat",
                value: track.views.toString(),
                inline: true
            }
        ],
    }, client);
    queue.metadata.channel.send({embeds: [embed]})  
}