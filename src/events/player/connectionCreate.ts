import { StreamDispatcher } from "discord-player";
import { PlayerEvent } from "PlayerEvent";

const evt: PlayerEvent = (client, queue, connection: StreamDispatcher) => {
    queue.metadata.channel.send(`Liitytään kanavalle...`);
}

export default evt;