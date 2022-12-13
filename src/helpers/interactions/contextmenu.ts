import { IlluminatiClient } from "../../structures"

export default (client: IlluminatiClient, interaction: any) => {
    IlluminatiClient.interactions.get(interaction.commandName).execute(interaction, client) 
}