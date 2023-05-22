import { StreamDispatcher } from "discord-player";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue, connection) => {
    if (!(connection instanceof StreamDispatcher)) return;
    queue.metadata.channel.send(`Liitytään kanavalle...`);

    client.metrics.playerCount.inc();
}


export default evt;