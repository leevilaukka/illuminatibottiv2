import { IlluminatiClient } from "../structures";
import IlluminatiGuild from "../structures/IlluminatiGuild";

export default async (_client: IlluminatiClient, oldGuild: IlluminatiGuild, newGuild: IlluminatiGuild) => {
    if (oldGuild.name !== newGuild.name) {
        await oldGuild.updateGuild({guildName: newGuild.name});
        console.log(`Palvelimen ${oldGuild} nimi vaihdettu: ${newGuild.name}`)
    }
};