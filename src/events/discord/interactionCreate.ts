import { Interaction } from "discord.js";
import { IlluminatiClient } from "../../structures";
import { SlashCommand, Button, SelectMenu, ContextMenu } from "../../helpers/interactions"

export default async (client: IlluminatiClient, interaction: Interaction)  => {
    console.log(interaction);


    if (interaction.isAutocomplete()) {
        const command = IlluminatiClient.commands.get(interaction.commandName);
        
        if (command && command.autocomplete) {
            command.autocomplete(client, interaction);
        }
    }
    else if (interaction.isChatInputCommand()) {
        const command = IlluminatiClient.commands.get(interaction.commandName);

        if (command && command.interactionRun) {
            command.interactionRun(client, interaction);
        }
    }

    return
}
