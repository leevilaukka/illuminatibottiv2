const Discord = require("discord.js") 
const {Guild} = require("../models")
const IlluminatiPlayer = require("./IlluminatiPlayer")

module.exports = class IlluminatiClient extends Discord.Client {
    constructor(options) {
        super(options)

        this.player = new IlluminatiPlayer(this, {highWaterMark: 50})
        this.config = require("../config")
        this.commands = new Discord.Collection();
        console.log(this)
    }

    getGuild = async (guild) => {
        let data = await Guild.findOne({ guildID: guild.id }).catch((e) =>
          console.error(e)
        );
        if (data) return data;
        else return client.config.defaultSettings;
    };

    updateGuild = async (guild, settings) => {
        let data = await client.getGuild(guild);
    
        if (typeof data !== "object") data = {};
        for (const key in settings) {
          if (data[key] !== settings[key]) data[key] = settings[key];
          else return;
        }
    
        console.log(
          `Guild "${data.guildName}" updated settings: ${Object.keys(settings)}`
        );
        return await data.updateOne(settings).catch((e) => console.error(e));
    };

    createGuild = async (settings) => {
        const newGuild = await new Guild(settings);
        return newGuild
          .save()
          .then((res) => {
            console.log(
              `Uusi palvelin luotu! Nimi: ${res.guildName} (${res.guildID})`
            );
          })
          .catch((error) => {
            console.error(error);
          });
      };

    deleteGuild = async (guild) => {
        await Guild.deleteOne({ guildID: guild.id });
        console.log(`Palvelin ${guild.name}(${guild.id}) poistettu :(`);
    }; 
    
    clean = (text) => {
        if (typeof text === "string")
          return text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    };   
}