import { EmbedBuilder } from "discord.js";
import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";
const command: Command = {
    name: "queue",
    aliases: ["q"],
    description: "Näytä nykyinen jono",
    category: Categories.music,
    guildOnly: true,
    async run(message, args, settings, client) {
        const queue = client.player.nodes.get(message.guild.id);

        const comingUp = queue.tracks.map((track) => {
            return {
                name: track.title,
                value: track.author,
            };
        });

        const embed = new IlluminatiEmbed(message, client)
            .setTitle("Jono")
            .setDescription(`Nyt soi: ${queue.currentTrack.title}`)
            .addFields(comingUp)
            .setThumbnail(queue.currentTrack.thumbnail)
            .setFooter({
                text: `Kappaleita jonossa: ${queue.tracks.data.length}`,
            })
            .setTimestamp();

        return message.channel.send({ embeds: [embed] });
    },
};
export default command;
