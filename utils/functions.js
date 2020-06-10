const ytdl = require("ytdl-core-discord");
const Guild = require("../models/Guild");
const fs = require("fs");

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
    };

    client.play = async (message, connection, url) => {
        let data = await client.getGuild(message.guild);
        const volume = data.volume;
        client.dispatcher = connection.play(await ytdl(url), {type: 'opus', highWaterMark: 50, volume});

        //Import events
        const dispatchEventFiles = fs.readdirSync('./events/dispatcher/').filter(file => file.endsWith('.js'));

        for (const file of dispatchEventFiles) {
            const dispatchEvt = require(`../events/dispatcher/${file}`);
            let dispatchEvtName = file.split(".")[0];
            console.log(`Loaded dispatcher evt: ${dispatchEvtName}`);
            client.dispatcher.on(dispatchEvtName, dispatchEvt.bind(null, client, connection))
        }

        // Always remember to handle errors appropriately!
        client.dispatcher.on('error', console.error);
    }
};