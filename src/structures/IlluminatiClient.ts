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
    CommandOptionDataTypeResolvable,
} from "discord.js";

import fs from "fs"

// DiscordPlayer
import { Player, PlayerInitOptions } from "discord-player";

import axios, { AxiosInstance } from "axios";

// Local imports
import { IlluminatiLogger, IlluminatiGuild, IlluminatiUser } from ".";

// Config imports
import config from "../config.js";
import info from "../../package.json";
import Types, { Command, SlashCommand } from "../types";
import Counter from "@pm2/io/build/main/utils/metrics/counter";
import IP from "../models/Ip";
import { codeBlock } from "@discordjs/builders";
import { IlluminatiJob } from "../schedules";
import { EventEmitter } from "events";
import { cwd } from "process";




/**
 * @name IlluminatiClient
 * @description Custom class for the bot client.
 * @extends Discord.Client
 */
export default class IlluminatiClient extends Client {
    // Types
    static commands: Collection<string, Command> = new Collection();
    static slashCommands: Collection<string, SlashCommand> = new Collection();
  
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

        this.setMaxListeners(0)

        this.env = process.env.NODE_ENV;

        this.isDevelopment = this.env === "development";
        this.isProduction = !this.isDevelopment;

        this.hostIP = JSON.parse(fs.readFileSync(`${cwd()}/config.json`, "utf-8")).ip;

        console.log("IP:", this.hostIP)
        this.events.emit("ready");
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
     * Get all user-interactable objects
     * @static
     * @see getCommands Method for commands
     * @see getInteractions Method for interactions
     * @returns Object with all the commands and interactions
     */
    static get Interactables(): {
        commands: Types.Command[];
    } {
        return {
            commands: [...this.Commands],
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



    async updateIP() {
        const newip = await this.axios.get("https://api.ipify.org/?format=json");
        console.log(newip.data.ip, this.hostIP)
        if (newip.data.ip !== this.hostIP) {
            this.hostIP = newip.data.ip;

            const file = fs.readFileSync(`${cwd()}/config.json`, "utf-8");

            const newConfig = JSON.parse(file);

            newConfig.ip = this.hostIP;

            fs.writeFileSync(`${cwd()}/config.json`, JSON.stringify(newConfig, null, 4));

            this.events.emit("ipChange", this.hostIP);
        }
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
        return `[${this.constructor.name}] {
            version: ${IlluminatiClient.packageInfo.version},
            isDevelopment: ${this.isDevelopment},
            ${
                this.user
                    && `user: {
                    tag: ${this.user.tag},
                    id: ${this.user.id}
                },`
            }
            guilds: ${this.guilds.cache.size},
            commands: ${IlluminatiClient.commands.size},
            readyAt: ${this.readyAt}
            shard: ${this.shard}
        }`;
    }

    log(asString: boolean = false) {
        console.log(asString ? this.toString() : this);
    }
}
