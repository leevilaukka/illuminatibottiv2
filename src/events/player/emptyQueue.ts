import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue) => {
    queue.metadata.channel.send(`Jono on tyhjä. Lopetetaan toisto.`);
}

export default evt;