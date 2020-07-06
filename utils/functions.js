const ytdl = require("ytdl-core-discord");
const Guild = require("../models/Guild");
const fs = require("fs");
module.exports = client => {
    //Get guild from database
    client.getGuild = async (guild) => {
        let data = await Guild.findOne({guildID: guild.id}).catch(e => console.error(e));
        if (data) return data;
        else return client.config.defaultSettings
    };
    // Update guild in database
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
    // Add guild to database
    client.createGuild = async (settings) => {
        const newGuild = await new Guild(settings);
        return newGuild.save()
            .then(res => {
                console.log(`Uusi palvelin luotu! Nimi: ${res.guildName} (${res.guildID})`)
            })
            .catch(error => {
                console.error(error)
            })
    };
    // Delete guild from database
    client.deleteGuild = async (guild) => {
        await Guild.deleteOne({guildID: guild.id});
        console.log(`Palvelin ${guild.name}(${guild.id}) poistettu :(`)
    };
    // Play YouTube video from given url
    client.play = async (message, url) => {
        if (message.member.voice.channel) {

            let data = await client.getGuild(message.guild);
            const volume = data.volume;

            client.voiceConnection = await message.member.voice.channel.join();
            client.dispatcher = client.voiceConnection.play(await ytdl(url), {type: 'opus', highWaterMark: 50, volume});

            //Import events
            const dispatchEventFiles = fs.readdirSync('./events/dispatcher/').filter(file => file.endsWith('.js'));

            for (const file of dispatchEventFiles) {
                const dispatchEvt = require(`../events/dispatcher/${file}`);
                let dispatchEvtName = file.split(".")[0];
                console.log(`Loaded dispatcher evt: ${dispatchEvtName}`);
                client.dispatcher.on(dispatchEvtName, dispatchEvt.bind(null, client))
            }
        } else {
            await message.channel.send("Et ole puhekanavalla, en voi liittyä");
        }
    }
};