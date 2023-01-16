import { GuildMember, GuildMemberManager } from "discord.js";
import Command from "IlluminatiCommand";
import { IlluminatiEmbed } from "../../../structures";

const command: Command = {
    name: "oldest",
    aliases: ["oldestuser", "oldestmember"],
    description: "Shows the oldest member in the server",
    category: "utility",
    async run(message, args, settings, client) {
        const members = await message.guild.members.fetch();
        let count: number

        if (args[0] === "all") {
            count = 25
        } else {
            count = parseInt(args[0]) || 5;
        }

        if (count > 25) {
            return message.channel.send("You can only show 25 oldest members at a time");
        }

        const oldest = members.sort((a, b) => a.user.createdTimestamp - b.user.createdTimestamp).first(count)

        new IlluminatiEmbed(message, client, {
            title: "Oldest members",
            fields: oldest.map((member, index) => {
                return {
                    name: `${index + 1}. ${member.user.tag}`,
                    value: `Created: ${new Date(member.user.createdTimestamp).toLocaleDateString("fi-FI")}`,
                }
            })
        }).send();
    }
}

export default command;