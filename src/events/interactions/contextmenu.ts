import { ContextMenuInteraction } from "discord.js"
import { IlluminatiClient } from "../../structures"

export default (client: IlluminatiClient, interaction: ContextMenuInteraction) => {
    client.interactions.get(interaction.commandName).execute(interaction, client)
    
}