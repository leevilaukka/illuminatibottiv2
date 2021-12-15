import Discord, { ClientOptions } from "discord.js"
import Guild from "../models/Guild.js"
import Command from "../types/IlluminatiCommand"
import config, { Config, GuildSettings } from "../config.js"
import { IlluminatiLogger, IlluminatiGuild, IlluminatiUser } from "."
import { Player,  PlayerInitOptions } from "discord-player"
import { Lyrics } from "@discord-player/extractor"
import { IlluminatiInteraction } from "../types/IlluminatiInteraction.js"
import { UserFunctions } from "./IlluminatiUser.js"
import axios, { AxiosInstance } from "axios"
import { Downloader } from "@discord-player/downloader"
import info from "../../package.json"

const setPlayerUses = (player: Player) => {
    player.use("YOUTUBE_DL", Downloader)
}

export default class IlluminatiClient extends Discord.Client {
    // Types
    commands: Discord.Collection<string, Command>
    interactions: Discord.Collection<string, IlluminatiInteraction>
    player: Player
    config: Config
    userManager: typeof UserFunctions
    guildManager: typeof IlluminatiGuild
    isDevelopment: boolean
    env: string
    axios: AxiosInstance
    logger: IlluminatiLogger
    lyrics: {
        search: (query: string) => Promise<Lyrics.LyricsData>
        client: any
    }
    info: typeof info

    constructor(clientOptions?: ClientOptions & {intents: number[]}, playerInitOptions?: PlayerInitOptions) {
        super(clientOptions)

        this.config = config
        this.commands = new Discord.Collection();
        this.isDevelopment = (process.env.NODE_ENV === "development");
        this.env = process.env.NODE_ENV
        this.logger = new IlluminatiLogger(this)
        this.userManager = IlluminatiUser
        this.guildManager = IlluminatiGuild
        this.axios = axios.create()
        this.player = new Player(this, playerInitOptions)
        this.lyrics = Lyrics.init(process.env.GENIUSAPI)
        this.interactions = new Discord.Collection<string, IlluminatiInteraction>();
        this.info = info

        setPlayerUses(this.player)
    }


    /**
     * Get the bot invite link
     * @method
     * @returns Invite link
     * @example
     * client.getBotInviteLink()
     **/

    async getBotInviteLink(): Promise<string> {
        return this.generateInvite({scopes: ["bot", "applications.commands"]});
    }

    /**
     * Get command by name
     * @method getCommand
     * @param {string} name
     */

    async getCommand(name: string): Promise<Command> {
        return this.commands.get(name) ||
        this.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(name)
        );
    }

    async getOwner(): Promise<Discord.User> {
        return await this.users.fetch(this.config.ownerID).then((user) => user);
    }

    /**
     * Get all commands as array
     * @method getCommands
     * @return {Command[]} Commands
     * @see getCommand
     * @example
     * client.getCommands().forEach(command => {
     *    console.log(command.name)
     * })
     */

    getCommands(): Command[] {
        return [...this.commands.values()];
    }

    /**
     * Get interaction by name
     * @method getInteraction
     * @param {string} name
     * @returns IlluminatiInteraction
     * @see getInteractions
     * @example
     * client.getInteraction("test").then(interaction => {
     *   console.log(interaction.name)
     * })
     */

    getInteraction(name: string): IlluminatiInteraction {
        return this.interactions.get(name)
    }

    /**
     * Get all interactions
     * @method getInteractions
     * @returns {IlluminatiInteraction[]} Array of IlluminatiInteractions
     * @memberof IlluminatiClient
     * @example
     * client.getInteractions()
     * // [IlluminatiInteraction, IlluminatiInteraction]
     */

    getInteractions(): IlluminatiInteraction[] {
        return [...this.interactions.values()];
    }

        /**
     * Get all userinteractable objects
     * @method
     * @see getCommands Method for commands
     * @see getInteractions Method for interactions
     * @returns Object with all the commands and interactions
     */
    getAllInteractables(): {commands: Command[], interactions: IlluminatiInteraction[]} {
        return {commands: [...this.getCommands()], interactions: [...this.getInteractions()]};
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

    async updateGuild(guild: Discord.Guild, settings: object): Promise<GuildSettings> {
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
     * @returns Clean string
     */
    clean(text: string): string {
        if (typeof text === "string")
            return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203));
        else return text;
    };
}