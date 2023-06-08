import { Guild } from "discord.js";
import { Document } from "mongoose";
import config, { GuildSettings } from "../config";
import GuildModel from "../models/Guild";
import { Errors } from ".";

type GuildPromise = Promise<
    (GuildSettings & Document<any, any, GuildSettings>) | GuildSettings
>;

// Filter out non-array types from T
type ArrayTypes<T> = {
    [K in keyof T as T[K] extends unknown[]
        ? K
        : never]: T[K] extends (infer U)[] ? U : never;
};

// Get array element type
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

export function GuildFunctions<T extends Guild>(guild: T) {
    return {
        /**
         * Log Guild to console
         */
        log: (): void => {
            console.log("Guild:", guild);
        },

        /**
         * Get Guild settings from database
         * @method
         * @returns Guild settings *or* Default settings
         */

        getGuild: async (): GuildPromise => {
            const guildSettings = await GuildModel.findOne({
                guildID: guild.id,
            });
            if (guildSettings) return guildSettings;
            else return config.defaultSettings;
        },

        updateGuildInfo: async <K extends keyof GuildSettings>(
            key: K,
            value: GuildSettings[K]
        ): GuildPromise => {
            const guildSettings = await GuildModel.findOne({
                guildID: guild.id,
            });
            if (guildSettings) {
                return await guildSettings
                    .updateOne({ [key]: value })
                    .catch((err) => {
                        throw new Errors.DatabaseError(err);
                    });
            } else {
                throw new Errors.DatabaseError("Guild settings not found");
            }
        },

        pushToArray: async <K extends keyof ArrayTypes<GuildSettings>>(
            key: K,
            value: ArrayElement<GuildSettings[K]>
        ): GuildPromise => {
            const guildSettings = await GuildModel.findOne({
                guildID: guild.id,
            });
            if (guildSettings) {
                return await guildSettings
                    .update({
                        $push: { [key]: value },
                    })
                    .catch((err) => {
                        throw new Errors.DatabaseError(err);
                    });
            } else {
                throw new Errors.DatabaseError("Guild settings not found");
            }
        },

        // Delete element from array
        pullFromArray: async <K extends keyof ArrayTypes<GuildSettings>>(
            key: K,
            value: ArrayElement<GuildSettings[K]>
        ): GuildPromise => {
            const guildSettings = await GuildModel.findOne({
                guildID: guild.id,
            });

            if (guildSettings) {
                return await guildSettings
                    .update({
                        $pull: { [key]: value },
                    })
                    .catch((err) => {
                        throw new Errors.DatabaseError(err);
                    });
            } else {
                throw new Errors.DatabaseError("Guild settings not found");
            }
        },

        /**
         * Update Guild settings to database
         * @method
         * @param {object} settings New settings
         * @returns Updated guild settings
         */

        batchUpdateGuild: async (
            settings: Partial<GuildSettings & { guildName: string }>
        ): Promise<object> => {
            let data: any = await GuildFunctions(guild).getGuild();

            if (typeof data !== "object") data = {};
            for (const key in settings) {
                if (data[key] !== settings[key]) data[key] = settings[key];
                else return;
            }

            return await data.updateOne(settings).catch((e) => {
                throw new Errors.DatabaseError(e);
            });
        },

        changeSetting: async <S extends keyof GuildSettings>(
            setting: S,
            newSetting: GuildSettings[S]
        ) => {
            try {
                await GuildFunctions(guild).batchUpdateGuild({
                    [setting]: newSetting,
                });
                return `${setting} päivitetty`;
            } catch (e) {
                throw new Errors.DatabaseError(e);
            }
        },

        /**
         * Create a new Guild to database
         * @method
         * @param {object} settings Guild settings
         * @returns New database guild settings
         */

        createGuild: async (settings: object): Promise<void | GuildPromise> => {
            const newGuild = new GuildModel(settings);
            return newGuild
                .save()
                .then((res) => {
                    return res;
                })
                .catch((error) => {
                    throw new Errors.DatabaseError(error);
                });
        },

        /**
         * Delete guild from database
         * @method
         */

        deleteGuild: async (): Promise<void> => {
            await GuildModel.deleteOne({ guildID: guild.id });
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
        },

        equals: (compareToGuild: Guild): boolean => {
            return compareToGuild.id === guild.id;
        },
    };
}

export default GuildFunctions;
