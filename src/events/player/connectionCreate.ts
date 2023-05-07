import io from "@pm2/io";
import { StreamDispatcher } from "discord-player";
import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = (client, queue, connection) => {
    if (!(connection instanceof StreamDispatcher)) return;
    queue.metadata.channel.send(`Liitytään kanavalle...`);

    client.metrics.playerCount.inc();

    // Fix for voice connection not being destroyed
    queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, 'networking');
        const newNetworking = Reflect.get(newState, 'networking');

        const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
            const newUdp = Reflect.get(newNetworkState, 'udp');
            clearInterval(newUdp?.keepAliveInterval);
        }

        oldNetworking?.off('stateChange', networkStateChangeHandler);
        newNetworking?.on('stateChange', networkStateChangeHandler);
    });
}


export default evt;