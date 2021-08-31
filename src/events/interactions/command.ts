import { CommandInteraction } from "discord.js";
import { IlluminatiClient } from "../../structures";

export default async (client: IlluminatiClient, interaction: CommandInteraction) => {
    console.log("CommandInteraction", interaction);
    client.interactions.get(interaction.commandName).execute(interaction, client)

}