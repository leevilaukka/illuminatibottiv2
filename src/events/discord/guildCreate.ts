import { Guild } from "discord.js";
import { IlluminatiClient } from "../../structures";
import { DatabaseError } from "../../structures/errors";

const evt = async (client: IlluminatiClient, guild: Guild) => {
    try {
        const newGuild = {
            guildID: guild.id,
            guildName: guild.name,
            joinedAt: guild.joinedAt
        };

        await client.guildManager(guild).createGuild(newGuild)

    } catch (e) {
        throw new DatabaseError(e)
    }
};

export default evt