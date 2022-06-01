import { GuildSettings } from './../config';
import { Message, PermissionResolvable } from "discord.js";
import { Config } from "../config";
import { IlluminatiClient } from "../structures";
import GuildFunctions from "../structures/IlluminatiGuild";
import UserFunctions from "../structures/IlluminatiUser";

export type CommandArguments = string[] | string;

type ArgTypes = ("string" | "number")[] 

type SlashOptions = {
    name: string,
    type: string,
    description: string,
    required?: boolean
}

// Metadata for a command, guild and user settings
type CommandMeta = { guild: ReturnType<typeof GuildFunctions>, user: ReturnType<typeof UserFunctions> }

export default interface Command {
    name: string,
    aliases?: string[],
    description?: string,
    guildOnly?: boolean,
    args?: boolean,
    usage?: string,
    category?: Categories | keyof typeof Categories,
    cooldown?: number,
    enableSlash?: boolean,
    outOfOrder?: boolean,
    options?: SlashOptions[],
    permissions?: PermissionResolvable[],
    ownerOnly?: boolean,
    argTypes?: ArgTypes
    run: (message: Message, args: CommandArguments, settings: GuildSettings , client: IlluminatiClient, meta: CommandMeta) => Promise<any>
    onInit?: (client: IlluminatiClient) => Promise<any>
}

export enum Categories {
    general = "Yleiset",
    music = "Musiikki",
    math = "Matematiikka",
    maps = "Kartat",
    config = "Asetukset",
    date = "Päivämäärät",
    currency = "Raha",
    other = "Muut",
    undefined = "Määrittelemätön",
}
