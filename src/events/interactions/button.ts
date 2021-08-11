import { ButtonInteraction } from "discord.js";
import { IlluminatiClient } from "../../structures";

export default (client: IlluminatiClient, interaction: ButtonInteraction) => {
    console.log("ButtonInteraction", interaction);
}