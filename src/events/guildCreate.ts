import { IlluminatiClient } from "../structures";

const evt = async (client: IlluminatiClient, guild: any) => {
    try {
        const newGuild = {
            guildID: guild.id,
            guildName: guild.name,
            joinedAt: guild.joinedAt
        };

        await client.createGuild(newGuild)
    } catch (e) {
        console.error(e)
    }
};

export default evt