import { Track } from "discord-player";
import { IlluminatiEmbed } from "../../structures";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue, track: Track) => {
    const embed = new IlluminatiEmbed(queue.metadata.message, client, {
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
    });
    queue.metadata.channel.send({embeds: [embed]})  
}

export default evt