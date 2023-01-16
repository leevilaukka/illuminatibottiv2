import Command from "IlluminatiCommand";
import { IlluminatiEmbed } from "../../../structures";

const command: Command = {
    name: "latest",
    aliases: ["latestuser", "latestmember"],
    description: "Shows the latest member in the server",
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
            return message.channel.send("You can only show 25 latest members at a time");
        }

        const latest = members.sort((a, b) => b.user.createdTimestamp - a.user.createdTimestamp).first(count)

        new IlluminatiEmbed(message, client, {
            title: "Latest members",
            fields: latest.map((member, index) => {
                return {
                    name: `${index + 1}. ${member.user.tag}`,
                    value: `Created: ${new Date(member.user.createdTimestamp).toLocaleDateString("fi-FI")}`,
                }
            })
        }).send();
    }
}