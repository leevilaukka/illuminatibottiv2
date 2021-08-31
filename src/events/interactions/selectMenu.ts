import { SelectMenuInteraction } from "discord.js"
import { IlluminatiClient } from "../../structures"

export default (client: IlluminatiClient, interaction: SelectMenuInteraction) => {
    console.log("SELECT_MENU", interaction)
    client.interactions.get(interaction.customId.split(":")[0]).update(interaction, client)
}