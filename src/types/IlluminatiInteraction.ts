import { APIApplicationCommandOption } from "discord-api-types"
import { ButtonInteraction, CommandInteraction, ContextMenuInteraction, MessageComponentInteraction, MessageInteraction, SelectMenuInteraction } from "discord.js"
import { IlluminatiClient } from "../structures"

type Interactions = CommandInteraction | MessageInteraction | ButtonInteraction | ContextMenuInteraction | SelectMenuInteraction | MessageComponentInteraction

export type IlluminatiInteraction = {
    data: {
        name: string
        type?: number
        description?: string
        options?: APIApplicationCommandOption[]
        [key: string]: any
    },
    permissions?: {
        id: string
        type: string
        permission: boolean
    },
    execute: (data: Interactions, client: IlluminatiClient) => void,
    update?: (data: Interactions, client: IlluminatiClient) => void,
}