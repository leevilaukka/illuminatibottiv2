import { ColorResolvable, Guild } from "discord.js";
import IGuild from "../models/Guild"
import config, { GuildSettings } from "../config";

export type GuildFunctions = {
    log: (guild: Guild) => void;
    getGuild: (guild: Guild) => Promise<GuildSettings>;
    updateGuild: (guild: Guild, settings: object) => Promise<object>;
    createGuild: (settings: object) => Promise<void>;
    botHexColor: (guild: Guild) => ColorResolvable;
    deleteGuild: (guild: Guild) => Promise<any>;
}

export const log = (guild: Guild) => {
    console.log("Guild log:", guild);
}

/**
 * Get Guild settings from database
 * @method
 * @returns Guild settings *or* Default settings
 */

export const getGuild = async (guild: Guild): Promise<GuildSettings> => {
    const guildSettings = await IGuild.findOne({ guildID: guild.id });
    if (guildSettings) return guildSettings;
    else return config.defaultSettings;
}

/**
 * Update Guild settings to database 
 * @method
 * @param {Discord.Guild} guild Discord Guild object
 * @param {object} settings New settings
 * @returns Updated guild settings
 */

export const updateGuild = async (guild: Guild, settings: object): Promise<object> => {
    let data: any = await getGuild(guild);

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

export const createGuild = async (settings: object) => {
    const newGuild = new IGuild(settings);
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

export const botHexColor = (guild: Guild): ColorResolvable => {
    return guild.me.displayHexColor;
}

/**
 * Delete guild from database
 * @method
 * @param {Discord.Guild} guild Discord Guild object
 */

export const deleteGuild = async (guild: Guild): Promise<any> => {
    await IGuild.deleteOne({ guildID: guild.id });
    console.log(`Palvelin ${guild.name}(${guild.id}) poistettu :(`);
};

export default {getGuild, updateGuild, createGuild, deleteGuild, botHexColor, log};

