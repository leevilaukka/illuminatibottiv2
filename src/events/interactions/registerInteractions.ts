import { IlluminatiClient } from "../../structures"
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export default async (client: IlluminatiClient, guildOnly) => {
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN)
    console.log(client.interactions)
    const interactions = [{
        name: 'premium',
        type: 2
    }]
    
    console.log("INTERACTIONS", interactions)

    try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(
			guildOnly ? Routes.applicationGuildCommands("729712438466838631", process.env.DEVSERVERID) : Routes.applicationCommands("670016290840379411"),
			{ body: interactions },
		).then(res => console.log("REST: ", res));

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}

}