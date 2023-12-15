import { Track } from "discord-player";
import { IlluminatiEmbed } from "../../structures";
import { PlayerEvent } from "../../types/PlayerMetadata";

const evt: PlayerEvent = (client, queue, track: Track) => {
    if(!queue.metadata?.message || queue.metadata?.fromAPI) return;
    
    new IlluminatiEmbed(queue.metadata.message, client, {
        title: "Kappale lisätty jonoon",
        description: `**${track.title}**`,
    }).send()
}
export default evt