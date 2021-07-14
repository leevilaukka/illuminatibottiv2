import Discord, { ClientOptions } from "discord.js"
import Guild  from "../models/Guild.js"
import { Player, PlayerOptions } from "discord-player"
import Command  from "../types/IlluminatiCommand"
import config from "../config.js"

export default class IlluminatiClient extends Discord.Client {
    // Types
    player: Player
    config: any
    commands: Discord.Collection<string, Command>
    isDevelopment: boolean
    env: string

    constructor(clientOptions?: ClientOptions | any, playerOptions?: PlayerOptions) {
        super(clientOptions)

        this.player = new Player(this, playerOptions)
        this.config = config
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

    async getGuild(guild: Discord.Guild) {
        let data = await Guild.findOne({ guildID: guild.id }).catch((e: any) =>
            console.error(e)
        );
        if (data) return data;
        else return this.config.defaultSettings;
    };

    /**
     * Update Guild settings to database 
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     * @param {object} settings New settings
     * @returns Updated guild settings
     */

    async updateGuild(guild: Discord.Guild, settings: object) {
        let data = await this.getGuild(guild);

        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
            else return;
        }

        console.log(
            `Guild "${data.guildName}" updated settings: ${Object.keys(settings)}`
        );
        return await data.updateOne(settings).catch((e: any) => console.error(e));
    };

    /**
     * Create new Guild to database
     * @method
     * @param {object} settings Guild settings
     * @returns New database guild settings
     */

    async createGuild(settings: object) {
        const newGuild = new Guild(settings);
        return newGuild
            .save()
            .then((res: any) => {
                console.log(
                    `Uusi palvelin luotu! Nimi: ${res.guildName} (${res.guildID})`
                );
            })
            .catch((error: any) => {
                console.error(error);
            });
    };


    /**
     * Delete guild from database
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     */

    async deleteGuild(guild: Discord.Guild) {
        await Guild.deleteOne({ guildID: guild.id });
        console.log(`Palvelin ${guild.name}(${guild.id}) poistettu :(`);
    };

    /**
     * Clean text
     * @method
     * @param {String} text
     * @returns 
     */

    clean(text: string) {
        if (typeof text === "string")
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    };
}