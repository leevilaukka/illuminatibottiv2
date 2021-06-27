const Discord = require("discord.js")
const { Guild } = require("../models")
const { Player } = require("discord-player")

module.exports = class IlluminatiClient extends Discord.Client {
    constructor(options) {
        super(options)

        this.player = new Player(this)
        this.config = require("../config");
        this.commands = new Discord.Collection();
        this.isDevelopment = (process.env.NODE_ENV === "development");
        this.env = process.env.NODE_ENV
    }

    /**
     * Get Guild settings from database
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     * @returns Guild settings *or* Default settings
     */

    async getGuild(guild) {
        let data = await Guild.findOne({ guildID: guild.id }).catch((e) =>
            console.error(e)
        );
        if (data) return data;
        else return client.config.defaultSettings;
    };

    /**
     * Update Guild settings to database 
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     * @param {object} settings New settings
     * @returns Updated guild settings
     */

    async updateGuild(guild, settings) {
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

    /**
     * Create new Guild to database
     * @method
     * @param {object} settings Guild settings
     * @returns New database guild settings
     */

    async createGuild(settings) {
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


    /**
     * Delete guild from database
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     */

    async deleteGuild(guild) {
        await Guild.deleteOne({ guildID: guild.id });
        console.log(`Palvelin ${guild.name}(${guild.id}) poistettu :(`);
    };

    /**
     * Clean text
     * @method
     * @param {String} text
     * @returns 
     */

    clean(text) {
        if (typeof text === "string")
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    };
}