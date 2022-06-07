import { Track } from "discord-player";
import { IlluminatiEmbed } from "../../structures";
import { PlayerError } from "../../structures/errors";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue, track: Track | Error) => {
    if (track instanceof Error) {
        throw new PlayerError(track.message)
    }
    
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
        footer: {
            text: track.requestedBy.tag,
            icon_url: track.requestedBy.displayAvatarURL({dynamic: true})
        }
    });
    queue.metadata.channel.send({embeds: [embed]})  
}

export default evt