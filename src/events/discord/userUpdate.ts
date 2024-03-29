import { User } from "discord.js";
import { IlluminatiClient, Errors } from "../../structures";

export default async (client: IlluminatiClient, oldUser: User, newUser: User) => {
    // Check if user is in database
    const user = new client.userManager(newUser)
    const savedUser = await user.getUser();

    // Check if user is in database
    if (!savedUser) return

    // Check if username changed
    if (oldUser.username !== newUser.username) {
        // Update username in database
        user.updateUser({ username: newUser.username });
    }
    return console.log("User updated!");
}