import { Interaction } from "discord.js";
import { IlluminatiClient } from "../../structures";
import { SlashCommand, Button, SelectMenu } from "../interactions"

export default async (client: IlluminatiClient, interaction: Interaction)  => {
    console.log(interaction);
    
    if(interaction.isCommand()) return SlashCommand(client, interaction);
    if(interaction.isButton()) return Button(client, interaction);
    if(interaction.isSelectMenu()) return SelectMenu(client, interaction);    
}
