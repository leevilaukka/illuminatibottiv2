import { TextChannel, codeBlock } from "discord.js";
import { IlluminatiClient } from "../../structures";

export default (client: IlluminatiClient, error: Error) => {
    // Log error
    console.error(error);


    const link = `https://discord.com/channels/${client.lastMessage.guildId}/${client.lastMessage.channelId}/${client.lastMessage.id}`
    // Send error to owner
    client.users.fetch(client.config.ownerID).then(user => {
        user.send(
        `### An error has occurred in the bot!
        Name: ${error.name}
        Message: ${error.message}
        Stack: ${codeBlock(error.stack)}

        Last message: ${client.lastMessage.content}
        Guild: ${client.lastMessage.guild.name}

        Link: ${link}
        `);
    });
}