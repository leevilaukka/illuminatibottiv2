import { Guild } from "discord.js";
import { IlluminatiClient } from "../../structures";
import { BotError } from "../../structures/Errors";

const evt = async (client: IlluminatiClient, guild: Guild) => {
    try {
        if (guild.available) {
            await client.guildManager(guild).deleteGuild();
        }
    } catch (e) {
        throw new BotError(e)
    }
};

export default evt