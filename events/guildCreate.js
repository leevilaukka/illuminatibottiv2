module.exports =  async (client, guild) => {
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