import { ColorResolvable, Guild } from "discord.js";
import IGuild from "../models/Guild"
import config, { GuildSettings } from "../config";
import { Document } from "mongoose";

type GuildPromise = Promise<GuildSettings & Document<any, any, GuildSettings> | GuildSettings>

const GuildFunctions = {
    log: (guild: Guild): void => {
        console.log("Guild log:", guild);
    },

    /**
     * Get Guild settings from database
     * @method
     * @returns Guild settings *or* Default settings
     */

    getGuild: async (guild: Guild): GuildPromise => {
        const guildSettings = await IGuild.findOne({ guildID: guild.id });
        if (guildSettings) return guildSettings;
        else return config.defaultSettings;
    },

    /**
     * Update Guild settings to database 
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     * @param {object} settings New settings
     * @returns Updated guild settings
     */

    updateGuild: async (guild: Guild, settings: object): Promise<object> => {
        let data: any = await GuildFunctions.getGuild(guild);

        if (typeof data !== "object") data = { };
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
            else return;
        }

        return await data.updateOne(settings).catch((e: any) => console.error(e));
    },

    /**
     * Create new Guild to database
     * @method
     * @param {object} settings Guild settings
     * @returns New database guild settings
     */

    createGuild: async (settings: object): Promise<void | GuildPromise> => {
        const newGuild = new IGuild(settings);
        return newGuild
            .save()
            .then((res) => {
                return res;
            })
            .catch((error: any) => {
                console.error(error);
            });
    },

    botHexColor: (guild: Guild): ColorResolvable => {
        return guild.me.displayHexColor;
    },

    /**
     * Delete guild from database
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     */

    deleteGuild: async (guild: Guild): Promise<void> => {
        await IGuild.deleteOne({ guildID: guild.id });
        console.log(`Palvelin ${guild.name}(${guild.id}) poistettu :(`);
    }
}

export default GuildFunctions;
