import { Track } from "discord-player";
import { IlluminatiClient, IlluminatiEmbed } from "../../structures";

export default (client: IlluminatiClient, queue: any, track: Track) => {
    const embed = new IlluminatiEmbed(queue.metadata.message, {
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
    }, client);
    queue.metadata.channel.send({embeds: [embed]})  
}