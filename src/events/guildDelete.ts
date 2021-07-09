import { IlluminatiClient } from "../structures/IlluminatiClient";

const evt = async (client: IlluminatiClient, guild: any) => {
    try {
        if (guild.available) {
            await client.deleteGuild(guild);
        }
    } catch (e) {
        console.error(e)
    }
};

export default evt