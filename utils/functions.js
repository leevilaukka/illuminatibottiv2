const mongoose = require("mongoose");
const Guild = require("../models/Guild");

module.exports = client => {

    client.getGuild = async (guild) => {
        let data = await Guild.findOne({ guildID: guild.id}).catch(e => console.error(e));
        if (data) return data;
        else return client.config.defaultSettings
    };

    client.updateGuild = async (guild, settings) => {
        let data = await client.getGuild(guild);

        if (typeof data !== 'object') data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
            else return;
        }

        console.log(`Guild "${data.guildName}" updated settings: ${Object.keys(settings)}`);
        return await data.updateOne(settings).catch(e => console.error(e));
    };

    client.createGuild = async (settings) => {
        const newGuild = await new Guild(settings);
        return newGuild.save()
            .then(res => {
                console.log(`Uusi palvelin luotu! Nimi: ${res.guildName} (${res.guildID})`)
            })
    };
    client.deleteGuild = async (guild) => {
        await Guild.deleteOne({guildID: guild.id});
        console.log(`Palvelin ${guild.name}(${guild.id}) poistettu :(`)
    }
};