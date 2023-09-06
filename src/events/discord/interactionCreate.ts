import { AutocompleteInteraction, ChatInputCommandInteraction, Interaction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { IlluminatiClient } from "../../structures";

const handleChatInput = async (client: IlluminatiClient, interaction: ChatInputCommandInteraction) => {    
    console.log(`Received command interaction: ${interaction.commandName}`);

    const commandName = interaction.commandName;
    const command = IlluminatiClient.slashCommands.find(cmd => cmd.data.name === commandName);

    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
};

const handleAutocomplete = async (client: IlluminatiClient, interaction: AutocompleteInteraction) => {
    console.log(`Received autocomplete interaction: ${interaction.commandName}`);

    const command = IlluminatiClient.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.autocomplete(client, interaction);
    } catch (error) {
        console.error(error);
    }
};

const handleUserContextMenu = async (client: IlluminatiClient, interaction: UserContextMenuCommandInteraction) => {
    console.log(`Received context menu interaction: ${interaction.commandName}`);

    const command = IlluminatiClient.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error(error);
    }
};

export default async (client: IlluminatiClient, interaction: Interaction)  => {    
    if(interaction.isAutocomplete()) {
        handleAutocomplete(client, interaction);
    }

    if (interaction.isUserContextMenuCommand()) {
        handleUserContextMenu(client, interaction);
    }

    if(interaction.isChatInputCommand()) {
        handleChatInput(client, interaction);
    } 
}
   
