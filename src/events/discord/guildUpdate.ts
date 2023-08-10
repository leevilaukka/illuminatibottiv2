import { Guild } from "discord.js";
import { IlluminatiClient } from "../../structures";

export default async (client: IlluminatiClient, oldGuild: Guild, newGuild: Guild) => {
    if (oldGuild.name !== newGuild.name) {
        await new client.guildManager(oldGuild).batchUpdateGuild({guildName: newGuild.name});
        console.log(`Palvelimen ${oldGuild} nimi vaihdettu: ${newGuild.name}`)
    }
};