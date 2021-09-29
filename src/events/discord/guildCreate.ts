import { Guild } from "discord.js";
import { IlluminatiClient } from "../../structures";

const evt = async (client: IlluminatiClient, guild: Guild) => {
    try {
        const newGuild = {
            guildID: guild.id,
            guildName: guild.name,
            joinedAt: guild.joinedAt
        };

        await client.guildManager(guild).createGuild(newGuild)

    } catch (e) {
        console.error(e)
    }
};

export default evt