import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue) => {
    queue.metadata.channel.send(`Kanava on tyhjä. Lopetetaan toisto.`);
    queue.stop();
}

export default evt;