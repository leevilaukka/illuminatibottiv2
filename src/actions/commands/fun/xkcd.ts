import { Command } from "../../../types"
import { IlluminatiEmbed } from "../../../structures";

const command: Command = {
    name: "xkcd",
    description: "Get a random xkcd comic",
    category: "fun",
    aliases: ["comic"],
    run: async (message, _, __, client) => {
        const { data: latest } = await client.axios.get("https://xkcd.com/info.0.json");

        const { data } = await client.axios.get(`https://xkcd.com/${Math.floor(Math.random() * latest.num) + 1}/info.0.json`);

        const date = new Date(data.year, data.month, data.day);
        const embed = new IlluminatiEmbed(message, client)
            .setTitle(data.safe_title)
            .setDescription(data.alt)
            .setImage(data.img)
            .setFooter({
                text: `xkcd #${data.num}`,
            })
            .setTimestamp(date);


        return message.channel.send({
            embeds: [embed],
        });
    },
    
};

export default command;
