import { Interaction } from "discord.js";
import { IlluminatiClient } from "../../structures";
import { SlashCommand, Button, SelectMenu, ContextMenu } from "../../helpers/interactions"

export default async (client: IlluminatiClient, interaction: Interaction)  => {
    console.log(interaction);

    if(interaction.isContextMenu()) return ContextMenu(client, interaction);
    if(interaction.isCommand()) return SlashCommand(client, interaction);
    if(interaction.isButton()) return Button(client, interaction);
    if(interaction.isSelectMenu()) return SelectMenu(client, interaction);   
    
    return
}
