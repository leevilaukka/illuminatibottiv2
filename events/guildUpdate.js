module.exports =  async (client, oldGuild, newGuild) => {
    if(oldGuild.name !== newGuild.name){
        await client.updateGuild(newGuild, {guildName:newGuild.name});
        console.log(`Palvelimen ${oldGuild} nimi vaihdettu: ${newGuild.name}`)
    }
};