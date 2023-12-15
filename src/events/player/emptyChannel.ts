import { PlayerEvent } from "../../types/PlayerMetadata";

const evt: PlayerEvent = async (client, queue) => {
    const leaveOnEmpty = (await new client.guildManager(queue.guild).getGuild()).leaveOnEmpty;

    if (leaveOnEmpty) queue.delete();
    else return;
}

export default evt;