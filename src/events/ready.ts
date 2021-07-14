import { IlluminatiClient } from "../structures";

export default (client: IlluminatiClient) => {
    console.log(`Logged in as ${client.user.tag}!`);

    // const commands = client.commands.array()
    // commands.forEach(command => {
    //     const commandData = {
    //         name: command.name,
    //         description: command.description,
    //         options: command.options
    //     }

    //     if(command.enableSlash) {
    //         //client.isDevelopment ? client.guilds.cache.get(devServerID).commands.create(commandData) : client.application.commands.create(commandData);
    //     }
    // });
};