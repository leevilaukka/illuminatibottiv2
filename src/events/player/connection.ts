import { StreamDispatcher } from "discord-player";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (_, queue, connection) => {
    if (!(connection instanceof StreamDispatcher)) return;
    queue.metadata.channel.send(`Liitytään kanavalle...`);
}


export default evt;