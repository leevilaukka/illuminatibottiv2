import { Message, PermissionResolvable } from "discord.js";
import { Config } from "../config";
import { IlluminatiClient } from "../structures";

export type CommandArguments = (string|number)[] 

export type Category = "general" | "music" | "math" | "maps" | "config" | "date" | "other" 

type ArgTypes = "string" | "number" 

type SlashOptions = {
    name: string,
    type: string,
    description: string,
    required?: boolean
}

export default interface Command {
    name: string,
    aliases?: string[],
    description?: string,
    guildOnly?: boolean,
    args?: boolean,
    usage?: string,
    category?: Category,
    cooldown?: number,
    enableSlash?: boolean,
    outOfOrder?: boolean,
    options?: SlashOptions[],
    permissions?: PermissionResolvable[],
    ownerOnly?: boolean,
    argTypes?: ArgTypes[]
    execute: (message: Message, args: CommandArguments, settings: Config | any, client: IlluminatiClient, interaction: any) => void
}

