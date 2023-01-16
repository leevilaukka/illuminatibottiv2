import { GuildMemberManager } from "discord.js";
import Command from "IlluminatiCommand";

const command: Command = {
    name: "oldest",
    aliases: ["oldestuser", "oldestmember"],
    description: "Shows the oldest member in the server",
    category: "utility",
    async run(message, args, settings, client) {
        const members = await message.guild.members.fetch();

        const oldest = members.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).first();

        message.channel.send(`The oldest member in this server is ${oldest.user.tag}!`)
    }
}

export default command;