import { Guild } from "discord.js";
import { IlluminatiClient } from "../../structures";

const evt = async (client: IlluminatiClient, guild: Guild) => {
    try {
        if (guild.available) {
            await client.guildManager(guild).deleteGuild();
        }
    } catch (e) {
        console.error(e)
    }
};

export default evt