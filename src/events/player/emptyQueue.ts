import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue) => {
    queue.metadata.channel.send(`Jono on tyhjä. Lopetetaan toisto.`);

    client.metrics.playerCount.dec();
}

export default evt;