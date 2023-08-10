// discord.js
import {
    Client,
    ClientOptions,
    Formatters,
    MessageMentions,
    Collection,
    User,
    Message,
    TextBasedChannel,
} from "discord.js";

// DiscordPlayer
import { Player, PlayerInitOptions } from "discord-player";
import { Downloader } from "@discord-player/downloader";
import { Client as GeniusClient } from "genius-lyrics";

import axios, { AxiosInstance } from "axios";

// Local imports
import { IlluminatiLogger, IlluminatiGuild, IlluminatiUser } from ".";

// Config imports
import config from "../config.js";
import info from "../../package.json";
import Types, { Command, IlluminatiInteraction } from "../types";
import io from "@pm2/io";
import Counter from "@pm2/io/build/main/utils/metrics/counter";
import IP from "../models/Ip";
import { codeBlock } from "@discordjs/builders";
import { Errors } from ".";
import { IlluminatiJob } from "../schedules";
import { EventEmitter } from "events";


/**
 * @name IlluminatiClient
 * @description Custom class for the bot client.
 * @extends Discord.Client
 */
export default class IlluminatiClient extends Client {
    // Types
    static commands: Collection<string, Command> = new Collection();
    static interactions: Collection<string, IlluminatiInteraction> = new Collection<
        string,
        Types.IlluminatiInteraction
    >();

    jobs: Collection<string, IlluminatiJob> = new Collection<string, IlluminatiJob>();

    metrics: {
        playerCount: Counter;
    };
    player: Player;
    config: typeof config = config;
    userManager: typeof IlluminatiUser = IlluminatiUser;
    guildManager: typeof IlluminatiGuild = IlluminatiGuild;
    isDevelopment: boolean;
    isProduction: boolean;
    env: string;
    axios: AxiosInstance = axios.create();;
    logger: IlluminatiLogger = new IlluminatiLogger(this);
    hostIP: string;
    events: EventEmitter = new EventEmitter();

    static packageInfo: typeof info = info;

    constructor(clientOptions: ClientOptions) {
        super(clientOptions);

        this.setMaxListeners(0);

        this.env = process.env.NODE_ENV;

        this.isDevelopment = this.env === "development";
        this.isProduction = !this.isDevelopment;

        this.events.on("command", (command) => {
            console.log(`[Command] ${command.name} executed!`);
        });
    }

    /**
     * Helper method to get the managers from the client
     * @param message Message to get the managers from
     */
    async getManagersFromMessage(message: Message) {
        const user = new this.userManager(message.author);
        const guild = new this.guildManager(message.guild);

        return {
            user,
            guild
        };
    }

    /**
     * Get command by name
     * @method getCommand
     */
    static getCommand(name: string): Types.Command {
        return (
            this.commands.get(name) ||
            this.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(name)
            )
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
     * Get all commands as array
     * @method Commands
     * @return {Command[]} Commands
     * @see getCommand
     * @example
     * client.getCommands().forEach(command => {
     *    console.log(command.name)
     * })
     */

    static get Commands(): Types.Command[] {
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
        return this.interactions.get(name);
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
    static get Interactables(): {
        commands: Types.Command[];
        interactions: IlluminatiInteraction[];
    } {
        return {
            commands: [...this.Commands],
            interactions: [...this.Interactions],
        };
    }

    /**
     * Get mentioned user
     * @param {string} mention Message content
     */

    static getUserFromMention(mention: string): User {
        // The id is the first and only match found by the RegEx.
        const matches = mention
            .matchAll(MessageMentions.UsersPattern)
            .next().value;

        // If supplied variable was not a mention, matches will be null instead of an array.
        if (!matches) return;

        // The first element in the matches array will be the entire mention, not just the ID,
        // so use index 1.
        const id = matches[1];

        return this.prototype.users.cache.get(id);
    }

    get ip(): string {
        return this.hostIP;
    }

    sendError(
        error: Error,
        target: Message | TextBasedChannel,
        showStack?: boolean
    ): Promise<Message> {
        console.error(error);

        if (target instanceof Message) {
            return target.reply(
                `:x: **${this.user.username}**: ${error.message} ${
                    showStack ? `\n ${codeBlock("js", error.stack)}` : ""
                }`
            );
        } else {
            return target.send(
                `:x: **${this.user.username}**: ${error.message} ${
                    showStack ? `\n ${codeBlock("js", error.stack)}` : ""
                }`
            );
        }
    }

    // Log this
    log() {
        console.log(this);
    }

    checkIP() {
        this.axios.get("https://api.ipify.org?format=json").then((res) => {
            this.hostIP = res.data.ip;

            IP.findOne({ botID: this.user.id })
                .then((res) => {
                    if (!res) {
                        IP.create({
                            botID: this.user.id,
                            ip: this.hostIP,
                        });
                    } else {
                        if (res.ip !== this.hostIP) {
                            IP.updateOne(
                                { botID: this.user.id },
                                {
                                    ip: this.hostIP,
                                }
                            );
                        }
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        });
    }

    get ipData() {
        return IP.findOne({ botID: this.user.id });
    }

    get apiStatus() {
        return this.axios.get("https://player.leevila.fi/api/status");
    }


    getPlayerLink<ID extends string, BaseURL extends string = "https://player.leevila.fi">(guildID: ID, baseURL = "https://player.leevila.fi" as BaseURL): `${BaseURL}/?guild=${ID}` {
        return `${baseURL}/?guild=${guildID}`;
    }

    toString(): string {
        return `[IlluminatiClient] {
            version: ${IlluminatiClient.packageInfo.version},
            isDevelopment: ${this.isDevelopment},
            ${
                this.user
                    ? `user: {
                    tag: ${this.user.tag},
                    id: ${this.user.id}
                },`
                    : ""
            }
            guilds: ${this.guilds.cache.size},
            commands: ${IlluminatiClient.commands.size},
            interactions: ${IlluminatiClient.interactions.size}
            readyAt: ${this.readyAt}
            shard: ${this.shard}
        }`;
    }
}
