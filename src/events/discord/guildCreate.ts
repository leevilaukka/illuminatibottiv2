import { Guild } from "discord.js";
import { IlluminatiClient } from "../../structures";
import { DatabaseError } from "../../structures/Errors";

const evt = async (client: IlluminatiClient, guild: Guild) => {
    try {
        await new client.guildManager(guild).createGuild({
            guildID: guild.id,
            guildName: guild.name,
            joinedAt: guild.joinedAt
        })

        guild.systemChannel.send("Thanks for adding me to your server! Use `!help` to get started!")
    } catch (e) {
        throw new DatabaseError(e)
    }
};

export default evt