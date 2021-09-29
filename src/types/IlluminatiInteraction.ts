import { ApplicationCommandData, ApplicationCommandOption, ButtonInteraction, CommandInteraction, CommandInteractionOptionResolver, ContextMenuInteraction, MessageComponentInteraction, MessageInteraction, SelectMenuInteraction } from "discord.js"
import { IlluminatiClient } from "../structures"

type Interactions = CommandInteraction | MessageInteraction | ButtonInteraction | ContextMenuInteraction | SelectMenuInteraction | MessageComponentInteraction

export type IlluminatiInteraction = {
    data: any,
    permissions?: {
        id: string
        type: string
        permission: boolean
    },
    execute: (data: Interactions, client: IlluminatiClient) => void,
    update?: (data: Interactions, client: IlluminatiClient) => void,
}

