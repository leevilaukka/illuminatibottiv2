import { IlluminatiClient } from "../../structures";

export default (client: IlluminatiClient, error: Error) => {
    // Log error
    console.error(error);

    // Send error to owner
    client.users.fetch(client.config.ownerID).then(user => {
        user.send(`An error has occurred in the bot: ${error.message}`);
    });
}