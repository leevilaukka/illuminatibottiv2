import Discord, { ClientOptions } from "discord.js"
import Guild from "../models/Guild.js"
import Command from "../types/IlluminatiCommand"
import config, { Config, GuildSettings } from "../config.js"
import { IlluminatiLogger, IlluminatiGuild, IlluminatiUser } from "."
import { UserFunctions } from "../structures/IlluminatiUser"
import { GuildFunctions } from "./IlluminatiGuild.js"
import { Player } from "discord-player"


export default class IlluminatiClient extends Discord.Client {
    // Types
    player: Player;
    config: Config
    commands: Discord.Collection<string, Command>
    isDevelopment: boolean
    env: string
    logger: IlluminatiLogger
    userManager: UserFunctions
    guildManager: GuildFunctions

    constructor(clientOptions?: ClientOptions & {intents: number[]}) {
        super(clientOptions)

        this.config = config
        this.commands = new Discord.Collection();
        this.isDevelopment = (process.env.NODE_ENV === "development");
        this.env = process.env.NODE_ENV
        this.logger = new IlluminatiLogger()
        this.userManager = IlluminatiUser
        this.guildManager = IlluminatiGuild
        this.player = new Player(this)
    }
    /**
     * Get command by name
     * @method getCommand
     * @param {string} name
     */

    async getCommand(name: string): Promise<Command> {
        return this.commands.get(name);
    }

    /**
     *  Get all commands as array
     *  @method getCommands
     * @return {Command[]} Commands
     */

    async getCommands(): Promise<Command[]> {
        return [...this.commands.values()];
    }

    // GUILD SETTINGS | refactor to IlluminatiGuild later

    /**
     * Get Guild settings from database
     * @method
     * @param {Discord.Guild} guild Discord Guild object
     * @returns Guild settings *or* Default settings
     */

    async getGuild(guild: Discord.Guild): Promise<GuildSettings> {
        const guildSettings = await Guild.findOne({ guildID: guild.id });
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

    async updateGuild(guild: Discord.Guild, settings: object) {
        let data: any = await this.getGuild(guild);

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