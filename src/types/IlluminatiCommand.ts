import { GuildSettings } from './../config';
import { Message, PermissionResolvable } from "discord.js";
import { IlluminatiClient } from "../structures";
import GuildFunctions from "../structures/IlluminatiGuild";
import UserFunctions from "../structures/IlluminatiUser";
import { RawInteractionData } from 'discord.js/typings/rawDataTypes';

export type CommandArguments = string[];

type ArgTypes = ("string" | "number")[] 

type SlashOptions = {
    name: string,
    type: string,
    description: string,
    required?: boolean
}

//** Metadata for a command, guild and user settings */ 
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
    argTypes?: ArgTypes,
    interaction?: {
        data: RawInteractionData,
        execute: (interaction: any, client: IlluminatiClient) => Promise<any>,
        update?: (interaction: any, client: IlluminatiClient) => Promise<any>
        reply?: (interaction: any, client: IlluminatiClient) => Promise<any>
    }
    run: (message: Message, args: CommandArguments, settings: GuildSettings , client: IlluminatiClient, meta: CommandMeta) => Promise<any>
    onInit?: (client: IlluminatiClient) => void
}

export enum Categories {
    general = "Yleiset",
    music = "Musiikki",
    math = "Matematiikka",
    maps = "Kartat",
    config = "Asetukset",
    date = "Päivämäärät",
    economy = "Raha",
    utility = "Apuohjelmat",
    fun = "Hauskat",
    
    other = "Muut",
    undefined = "Määrittelemätön",
}
