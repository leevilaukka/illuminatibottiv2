import { VoiceState } from "discord.js";
import { IlluminatiClient } from "../../structures";

const evt = async (
    client: IlluminatiClient,
    oldState: VoiceState,
    newState: VoiceState
) => {
    if (newState.id !== client.user.id) return;

    if (oldState.channelId === newState.channelId) return;
    
    const guild = new client.guildManager(newState.guild);

    await guild.updateGuildInfo("lastUsedVoiceChannel", newState.channelId);
 
};

export default evt;
