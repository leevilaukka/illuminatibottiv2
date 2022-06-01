import { BotError } from './../types/BotError';
import { ColorResolvable, Guild } from "discord.js";
import { Document } from "mongoose";
import config, { GuildSettings } from "../config";
import IGuild from "../models/Guild";

type GuildPromise = Promise<GuildSettings & Document<any, any, GuildSettings> | GuildSettings>

export function GuildFunctions(guild: Guild) {
    return {
        /**
         * Log Guild to console
         */
        log: (): void => {
            console.log("Guild log:", guild);
        },

        /**
         * Get Guild settings from database
         * @method
         * @returns Guild settings *or* Default settings
         */

        getGuild: async (): GuildPromise => {
            const guildSettings = await IGuild.findOne({ guildID: guild.id });
            if (guildSettings) return guildSettings;
            else return config.defaultSettings;
        },

        /**
         * Update Guild settings to database 
         * @method
         * @param {object} settings New settings
         * @returns Updated guild settings
         */

        updateGuild: async (settings: Partial<GuildSettings>): Promise<object> => {
            let data: any = await GuildFunctions(guild).getGuild();

            if (typeof data !== "object") data = {};
            for (const key in settings) {
                if (data[key] !== settings[key]) data[key] = settings[key];
                else return;
            }

            return await data.updateOne(settings).catch((e: any) => console.error(e));
        },

        changeSetting: async <S extends keyof GuildSettings>(setting: S, newSetting: GuildSettings[S]) => {
            try {
                await GuildFunctions(guild).updateGuild({[setting]: newSetting });
                return `${setting} päivitetty`;
            } catch (e) {
                throw {
                    error: e,
                    message: `Tapahtui virhe: ${e.message}`
                };
            }
        },
        

        /**
         * Create a new Guild to database
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

        botHexColor: (): ColorResolvable => {
            return guild.me.displayHexColor;
        },

        /**
         * Delete guild from database
         * @method
         */

        deleteGuild: async (): Promise<void> => {
            await IGuild.deleteOne({ guildID: guild.id });
            console.log(`Palvelin ${guild.name}(${guild.id}) poistettu :(`);
        },

        /**
         * Check if a command is disabled on this guild
         * @method
         * @param {string} command Command name
         * @returns {boolean}
         * @example
         * if (GuildFunctions(guild).isCommandDisabled("ping")) {
         *    console.log("Pinging is disabled on this guild");
         * }
         */

        isCommandDisabled: async (command: string): Promise<boolean> => {
            const guildSettings = await GuildFunctions(guild).getGuild();
            return guildSettings.disabledCommands.includes(command);
        }
        
    }
}

export default GuildFunctions;
