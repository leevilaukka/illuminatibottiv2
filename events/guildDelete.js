module.exports =  async (client, guild) => {
    try {
        if(guild.available){
            await client.deleteGuild(guild);
        }
    }catch (e) {
        console.error(e)
    }
};