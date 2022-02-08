import { ButtonInteraction } from "discord.js";
import { IlluminatiClient } from "../../structures";

export default (client: IlluminatiClient, interaction: ButtonInteraction) => {
    console.log("ButtonInteraction", interaction);
    client && IlluminatiClient.interactions.get(interaction.customId.split(":")[0]).update(interaction, client)
}