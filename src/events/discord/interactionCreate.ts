import { AutocompleteInteraction, ChatInputCommandInteraction, Interaction, MessageContextMenuCommandInteraction, UserContextMenuCommandInteraction } from "discord.js";
import { IlluminatiClient } from "../../structures";

const handleChatInput = async (client: IlluminatiClient, interaction: ChatInputCommandInteraction) => {    
    console.log(`Received command interaction: ${interaction.commandName}`);

    const commandName = interaction.commandName;
    const command = IlluminatiClient.slashCommands.find(cmd => cmd.data.name === commandName);

    if (!command) return;

    await command.execute(client, interaction);
};

const handleAutocomplete = async (client: IlluminatiClient, interaction: AutocompleteInteraction) => {
    console.log(`Received autocomplete interaction: ${interaction.commandName}`);

    const command = IlluminatiClient.slashCommands.get(interaction.commandName);

    if (!command) return;

    await command.autocomplete(client, interaction);
};

const handleUserContextMenu = async (client: IlluminatiClient, interaction: UserContextMenuCommandInteraction) => {
    console.log(`Received context menu interaction: ${interaction.commandName}`);

    const command = IlluminatiClient.slashCommands.get(interaction.commandName);

    if (!command) return;

    await command.execute(client, interaction);
};

export default async (client: IlluminatiClient, interaction: Interaction)  => {    
    try {
        if(interaction.isAutocomplete()) {
            handleAutocomplete(client, interaction);
        }
    
        if (interaction.isUserContextMenuCommand()) {
            handleUserContextMenu(client, interaction);
        }
    
        if(interaction.isChatInputCommand()) {
            handleChatInput(client, interaction);
        } 
    } catch (error) {
        console.error(error);

        if (interaction.isAutocomplete()) return
        
        const repliedOrDeferred = interaction.replied || interaction.deferred;

        if (repliedOrDeferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }
    
   
}
   
