// discord.js
import { Client, ClientOptions, Formatters, MessageMentions, Collection, User, Message, TextBasedChannel } from "discord.js"

// DiscordPlayer
import { Player,  PlayerInitOptions } from "discord-player"
import { Lyrics } from "@discord-player/extractor"
import { Downloader } from "@discord-player/downloader"
import { Client as GeniusClient } from 'genius-lyrics';

import axios, { AxiosInstance } from "axios"

// Local imports
import Command from "IlluminatiCommand"
import { IlluminatiLogger, IlluminatiGuild, IlluminatiUser } from "."
import { IlluminatiInteraction } from "IlluminatiInteraction"

// Config imports
import config from "../config.js"
import info from "../../package.json"

const setPlayerUses = (player: Player) => {
    player.use("YOUTUBE_DL", Downloader)
    console.log("Player uses set")
}


/**
 * @name IlluminatiClient
 * @description Custom class for the bot client.
 * @extends Discord.Client 
 */
export default class IlluminatiClient extends Client {
    // Types
    static commands: Collection<string, Command>
    static interactions: Collection<string, IlluminatiInteraction>
    player: Player
    config: typeof config
    userManager: typeof IlluminatiUser
    guildManager: typeof IlluminatiGuild
    isDevelopment: boolean
    isProduction: boolean
    env: string
    axios: AxiosInstance
    logger: IlluminatiLogger
    lyrics: {
        search: (query: string) => Promise<Lyrics.LyricsData>
        client: GeniusClient
    }
    static packageInfo: typeof info


    constructor(clientOptions: ClientOptions, playerInitOptions: PlayerInitOptions) {
        super(clientOptions)

        // Set static members
        IlluminatiClient.commands = new Collection();
        IlluminatiClient.interactions = new Collection<string, IlluminatiInteraction>();
        IlluminatiClient.packageInfo = info

        // Metadata
        this.config = config
        this.isDevelopment = (this.env === "development");
        this.isProduction = !this.isDevelopment;
        this.env = process.env.NODE_ENV

        // Helpers
        this.logger = new IlluminatiLogger(this)
        this.player = new Player(this, playerInitOptions)
        this.lyrics = Lyrics.init(process.env.GENIUSAPI)
        this.axios = axios.create()

        // Manager instances
        this.userManager = IlluminatiUser
        this.guildManager = IlluminatiGuild
        
        setPlayerUses(this.player)
    }

    /**
     * Helper method to get the managers from the client
     * @param message Message to get the managers from
     */
    getManagersFromMessage(message: Message) {
        return {user: this.userManager(message.author), guild: this.guildManager(message.guild)}
    }

    /**
     * Get command by name
     * @method getCommand
     */
    static getCommand(name: string): Command {
        return this.commands.get(name) ||
        this.commands.find(
            (cmd) => cmd.aliases && cmd.aliases.includes(name)
        );
    }

    /**
     * Get bot owner as a user
     * @returns Promise with the user
     */
    get owner(): Promise<User> {
        return this.users.fetch(this.config.ownerID).then((user) => user);
    }

    /**
     * Get WebSocket ping
     */
    get wsPing(): number {
        return this.ws.ping
    }

    /**
     * Get all commands as array
     * @method Commands
     * @return {Command[]} Commands
     * @see getCommand
     * @example
     * client.getCommands().forEach(command => {
     *    console.log(command.name)
     * })
     */

    static get Commands(): Command[] {
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
     */

    static get Interactions(): IlluminatiInteraction[] {
        return [...this.interactions.values()];
    }

    /**
     * Get all user-interactable objects
     * @static
     * @see getCommands Method for commands
     * @see getInteractions Method for interactions
     * @returns Object with all the commands and interactions
     */
    static get Interactables(): {commands: Command[], interactions: IlluminatiInteraction[]} {
        return {commands: [...this.Commands], interactions: [...this.Interactions]};
    }

    /**
     * Get mentioned user
     * @param {string} mention Message content
     */

    static getUserFromMention(mention: string): User {
            // The id is the first and only match found by the RegEx.
        const matches = mention.matchAll(MessageMentions.UsersPattern).next().value;

        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches) return;

        // The first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];

        return this.prototype.users.cache.get(id);
    }

    sendError(error: Error, target: Message | TextBasedChannel, showStack?: boolean): Promise<Message> {
        console.error(error)

        if (target instanceof Message) {
            return this._replyError(error, target, showStack);
        } else {
            return this._sendErrorToChannel(error, target, showStack);
        }
    }

    private _sendErrorToChannel(error: Error, channel: TextBasedChannel, showStack?: boolean): Promise<Message> {
        return channel.send(`:x: **${this.user.username}**: ${error.message} ${showStack ? `\n ${Formatters.codeBlock("js", error.stack)}` : ""}`)
    }

    private _replyError(error: Error, message: Message, showStack?: boolean): Promise<Message> {
        return message.reply(`:x: **${this.user.username}**: ${error.message} ${showStack ? `\n ${Formatters.codeBlock("js", error.stack)}` : ""}`)
    }

    // Log this
    log() {
        console.log(this)
    }
    
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
            ping: ${this.wsPing}
        }`
    }
}

