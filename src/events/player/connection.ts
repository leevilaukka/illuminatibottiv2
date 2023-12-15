import { StreamDispatcher } from "discord-player";
import { PlayerEvent } from "../../types/PlayerMetadata";

const evt: PlayerEvent = (_, queue, connection) => {
    if (!(connection instanceof StreamDispatcher)) return;
    queue.metadata.channel.send(`Liitytään kanavalle...`);
}


export default evt;