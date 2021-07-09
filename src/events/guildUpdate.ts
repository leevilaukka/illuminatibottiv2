import { IlluminatiClient } from "../structures/IlluminatiClient";

export default async (client: IlluminatiClient, oldGuild: any, newGuild: any) => {
    if (oldGuild.name !== newGuild.name) {
        await client.updateGuild(newGuild, {guildName: newGuild.name});
        console.log(`Palvelimen ${oldGuild} nimi vaihdettu: ${newGuild.name}`)
    }
};