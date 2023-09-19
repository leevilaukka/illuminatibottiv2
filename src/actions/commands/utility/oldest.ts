import { Command } from "../../../types"
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

        let oldest = members.sort((a, b) => a.user.createdTimestamp - b.user.createdTimestamp).first(count)

        if(args[1] === "nobot") oldest = oldest.filter(member => !member.user.bot)

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