import { REST, Routes } from "discord.js";
import { IlluminatiClient } from "../../structures";


export default (client: IlluminatiClient) => {
    console.log(`Logged in as ${client.user?.tag}!`);

    client.updateIP();

    client.jobs.get("digitalocean")?.run(client)(new Date());

    registerSlashCommands(client);
};

const registerSlashCommands = async (client: IlluminatiClient) => {
    const commands = [];
    const slashCommads = IlluminatiClient.slashCommands;

    for (const name of slashCommads.keys()) {
        const command = slashCommads.get(name);
        console.log("Registering ", command);
        commands.push(command.data);
    }

    const rest = new REST({ version: '10' }).setToken(client.config.token);

    try {
        console.log('Started refreshing application (/) commands.');

        client.isDevelopment && await rest.put(
            Routes.applicationGuildCommands(client.user.id, process.env.DEVSERVERID),
            { body: commands },
        );

        !client.isDevelopment && await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        ).then((res) => console.log(res));

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
};
