import { IlluminatiClient } from "../../structures"
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export default async (client: IlluminatiClient) => {
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
	
	const interactions = client.getInteractions().map(interaction => {
		return interaction.data
	})
    
    try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			client.isDevelopment ? Routes.applicationGuildCommands("729712438466838631", process.env.DEVSERVERID) : Routes.applicationCommands("670016290840379411"),
			{ body: interactions },
		).then((res) => console.log("REST: ", res));
 	} catch (error) {
		client.logger.error(error);
	}
}