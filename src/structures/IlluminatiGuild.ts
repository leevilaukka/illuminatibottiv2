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

class IlluminatiGuild<T extends Guild> {
    guild: T;
    constructor(guild: T) {
        this.guild = guild;
    }

    /**
         * Log Guild to console
         */
    log(): void {
        console.log("Guild:", this.guild);
    }

    /**
     * Get Guild settings from database
     * @method
     * @returns Guild settings *or* Default settings
     */


    async getGuild(): GuildPromise {
        const guildSettings = await GuildModel.findOne({
            guildID: this.guild.id,
        });
        if (guildSettings) return guildSettings;
        else return config.defaultSettings;
    }

    async updateGuildInfo<K extends keyof GuildSettings> (
        key: K,
        value: GuildSettings[K]
    ): GuildPromise {
        const guildSettings = await GuildModel.findOne({
            guildID: this.guild.id,
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
    }

    async pushToArray<K extends keyof ArrayTypes<GuildSettings>>(
        key: K,
        value: ArrayElement<GuildSettings[K]>
    ): GuildPromise {
        const guildSettings = await GuildModel.findOne({
            guildID: this.guild.id,
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
    }

    // Delete element from array
    async pullFromArray<K extends keyof ArrayTypes<GuildSettings>>(
        key: K,
        value: ArrayElement<GuildSettings[K]>
    ): GuildPromise {
        const guildSettings = await GuildModel.findOne({
            guildID: this.guild.id,
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
    }

    /**
     * Update Guild settings to database
     * @method
     * @param {object} settings New settings
     * @returns Updated guild settings
     */

    async batchUpdateGuild(
        settings: Partial<GuildSettings & { guildName: string }>
    ): Promise<object> {
        let data: any = await this.getGuild();

        if (typeof data !== "object") data = {};
        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key];
            else return;
        }

        return await data.updateOne(settings).catch((e) => {
            throw new Errors.DatabaseError(e);
        });
    }

    async changeSetting<S extends keyof GuildSettings>(
        setting: S,
        newSetting: GuildSettings[S]
    ) {
        try {
            await this.batchUpdateGuild({
                [setting]: newSetting,
            });
            return `${setting} päivitetty`;
        } catch (e) {
            throw new Errors.DatabaseError(e);
        }
    }

    /**
     * Create a new Guild to database
     * @method
     * @param {object} settings Guild settings
     * @returns New database guild settings
     */

    async createGuild(settings: object): Promise<void | GuildPromise> {
        const newGuild = new GuildModel(settings);
        return newGuild
            .save()
            .then((res) => {
                return res;
            })
            .catch((error) => {
                throw new Errors.DatabaseError(error);
            });
    }

    /**
     * Delete guild from database
     * @method
     */

    async deleteGuild(): Promise<void>{
        await GuildModel.deleteOne({ guildID: this.guild.id });
        console.log(`Palvelin ${this.guild.name}(${this.guild.id}) poistettu :(`);
    }

    /**
     * Check if a command is disabled on this guild
     * @method
     * @param {string} command Command name
     * @returns {boolean}
     * @example
     * if (isCommandDisabled("ping")) {
     *    console.log("Pinging is disabled on this guild");
     * }
     */

    async isCommandDisabled(command: string): Promise<boolean> {
        const guildSettings = await this.getGuild();
        return guildSettings.disabledCommands.includes(command);
    }

    get playerLink(): string {
        return `https://player.leevila.fi/?guild=${this.guild.id}`;
    }

    equals(compareToGuild: Guild): boolean {
        return compareToGuild.id === this.guild.id;
    }
}


export default IlluminatiGuild;
