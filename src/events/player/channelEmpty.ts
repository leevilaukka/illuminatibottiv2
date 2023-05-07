import { PlayerEvent } from "../../types/PlayerEvent";

const evt: PlayerEvent = async (client, queue) => {
    const leaveOnEmpty = (await client.guildManager(queue.guild).getGuild()).leaveOnEmpty;

    if (leaveOnEmpty) queue.destroy(true);

    client.metrics.playerCount.dec();

    return;
}

export default evt;