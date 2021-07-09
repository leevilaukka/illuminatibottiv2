import { Message } from "discord.js";
import { Category } from "./Category";

export type CommandArguments = (string|number)[] 

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
    permissions?: string[],
    ownerOnly?: boolean,
    execute(message: Message, args: CommandArguments, client: any, settings: any, interaction: any): any
}

