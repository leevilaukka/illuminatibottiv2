import { IlluminatiClient } from "../structures";
import IlluminatiGuild from "../structures/IlluminatiGuild";

const evt = async (client: IlluminatiClient, guild: IlluminatiGuild) => {
    try {
        const newGuild = {
            guildID: guild.id,
            guildName: guild.name,
            joinedAt: guild.joinedAt
        };

        await guild.createGuild(newGuild)

    } catch (e) {
        console.error(e)
    }
};

export default evt