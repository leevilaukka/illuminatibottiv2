import { Guild } from "discord.js";
import IlluminatiClient from "./IlluminatiClient";
import IGuild from "../models/Guild"
import { GuildSettings } from "../config";

export default class IlluminatiGuild extends Guild {
    config: import("d:/Koodailut/illuminatibottiv2/src/config").Config;

    constructor(client: IlluminatiClient, data: object){
        super(client, data);
        this.config = client.config
    }

    log() {
        console.log("Guild log:",this);
    }


    /**
     * Get Guild settings from database
     * @method
     * @returns Guild settings *or* Default settings
     */

    async getGuild(): Promise<GuildSettings> {
        const guildSettings = await IGuild.findOne({ guildID: this.id });
        if (guildSettings) return guildSettings;
        else return this.config.defaultSettings;
    }

    /**
     * Update Guild settings to database 
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     * @param {object} settings New settings
     * @returns Updated guild settings
     */

     async updateGuild(settings: object) {
        let data: any = await this.getGuild();

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

    /**
     * Delete guild from database
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     */

     async deleteGuild() {
        await IGuild.deleteOne({ guildID: this.id });
        console.log(`Palvelin ${this.name}(${this.id}) poistettu :(`);
    };

}
