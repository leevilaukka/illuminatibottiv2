import Discord, { ClientOptions } from "discord.js"
import Command from "IlluminatiCommand"
import config, { Config } from "../config.js"
import { IlluminatiLogger, IlluminatiGuild, IlluminatiUser } from "."
import { Player,  PlayerInitOptions } from "discord-player"
import { Lyrics } from "@discord-player/extractor"
import { IlluminatiInteraction } from "IlluminatiInteraction"
import { UserFunctions } from "./IlluminatiUser.js"
import axios, { AxiosInstance } from "axios"
import { Downloader } from "@discord-player/downloader"
import info from "../../package.json"

const setPlayerUses = (player: Player) => {
    player.use("YOUTUBE_DL", Downloader)
    console.log("Player uses set")
}

export default class IlluminatiClient extends Discord.Client {
    // Types
    static commands: Discord.Collection<string, Command>
    static interactions: Discord.Collection<string, IlluminatiInteraction>
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
    static packageInfo: typeof info

    
    constructor(clientOptions?: ClientOptions & {intents: number[]}, playerInitOptions?: PlayerInitOptions) {
        super(clientOptions)

        this.config = config
        IlluminatiClient.commands = new Discord.Collection();
        this.isDevelopment = (process.env.NODE_ENV === "development");
        this.env = process.env.NODE_ENV
        this.logger = new IlluminatiLogger(this)
        this.userManager = IlluminatiUser
        this.guildManager = IlluminatiGuild
        this.axios = axios.create()
        this.player = new Player(this, playerInitOptions)
        this.lyrics = Lyrics.init(process.env.GENIUSAPI)
        IlluminatiClient.interactions = new Discord.Collection<string, IlluminatiInteraction>();
        IlluminatiClient.packageInfo = info

        setPlayerUses(this.player)
    }

    /**
     * Get the bot invite link
     * @getter
     * @returns Invite link
     * @example
     * client.botInviteLink
     **/

    get botInviteLink(): string {
        return this.generateInvite({scopes: ["bot", "applications.commands"]});
    }

    /**
     * Get command by name
     * @method getCommand
     * @param {string} name
     */

    static getCommand(name: string): Command {
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

    static getCommands(): Command[] {
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

    static getInteraction(name: string): IlluminatiInteraction {
        return this.interactions.get(name)
    }

    /**
     * Get all interactions
     * @method getInteractions
     * @returns {IlluminatiInteraction[]} Array of IlluminatiInteractions
     * @memberof IlluminatiClient
     * @example
     * client.getInteractions() -- [IlluminatiInteraction, IlluminatiInteraction]
     */

    static getInteractions(): IlluminatiInteraction[] {
        return [...this.interactions.values()];
    }

        /**
     * Get all userinteractable objects
     * @method
     * @see getCommands Method for commands
     * @see getInteractions Method for interactions
     * @returns Object with all the commands and interactions
     */
    static getAllInteractables(): {commands: Command[], interactions: IlluminatiInteraction[]} {
        return {commands: [...this.getCommands()], interactions: [...this.getInteractions()]};
    }

    sendError(error: Error, channel: Discord.TextBasedChannels): Promise<Discord.Message> {
        return channel.send(`:x: **${this.user.username}**: ${error.message}`)
    }

    // Log this object
    log() {
        console.log(this)
    }

    // toString 
    toString(): string {
        return `[IlluminatiClient] {
            version: ${IlluminatiClient.packageInfo.version},
            isDevelopment: ${this.isDevelopment},
            ${
                this.user ? `user: {
                    tag: ${this.user.tag},
                    id: ${this.user.id}
                },` : ""
            }
            guilds: ${this.guilds.cache.size},
            commands: ${IlluminatiClient.commands.size},
            interactions: ${IlluminatiClient.interactions.size}
            readyAt: ${this.readyAt}
            shard: ${this.shard}
        }`
    }
}