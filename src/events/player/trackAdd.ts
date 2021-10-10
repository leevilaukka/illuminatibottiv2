import { Track } from "discord-player";
import { IlluminatiEmbed } from "../../structures";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue, track: Track) => {
    new IlluminatiEmbed(queue.metadata.message, client, {
        title: `Lisätty jonoon: ${track.title}`,
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
            icon_url: track.requestedBy.displayAvatarURL({ dynamic: true })
        }
    }).send()
}
export default evt