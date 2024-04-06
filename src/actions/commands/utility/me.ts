import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
const command: Command<0> = {
    name: "me",
    aliases: ["mä"],
    description: "View your profile",
    category: Categories.utility,
    async run(message, args, settings, client, { user }) {
        (await user.infoAsEmbed(message, client)).send();
    },
};
export default command;
