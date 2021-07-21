import { IlluminatiClient } from "../structures";
import IlluminatiGuild from "../structures/IlluminatiGuild";

const evt = async (client: IlluminatiClient, guild: IlluminatiGuild) => {
    try {
        if (guild.available) {
            await guild.deleteGuild();
        }
    } catch (e) {
        console.error(e)
    }
};

export default evt