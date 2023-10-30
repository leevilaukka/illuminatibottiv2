import { IlluminatiEmbed } from "../../../structures";
import { Command } from "../../../types";
import { Categories } from "../../../types/IlluminatiCommand";

const command: Command = {
    name: "queue",
    aliases: ["q"],
    description: "Näytä nykyinen jono",
    category: Categories.music,
    guildOnly: true,
    async run(message, args, settings, client, { queue }) {
        const comingUpPages = [[]];

        if (queue.metadata.queueHidden) {
            return message.channel.send("Jono on piilotettu");
        }

        queue.tracks.map((track, index) => {
            if (index % 10 === 0) {
                comingUpPages.push([]);
            }

            comingUpPages[Math.floor(index / 10)].push(track);
        });

        const mainPage = new IlluminatiEmbed(message, client, {
            title: "Jono",
            description: `**Nyt soi:** ${queue.currentTrack.title} (${queue.currentTrack.author})`,
            fields: comingUpPages[0].map((track) => ({
                name: `${track.title}`,
                value: `Lisännyt: ${track.requestedBy.tag}`,
            })),
        });

        if (comingUpPages.length > 0) {
            const newPages = comingUpPages.slice(1);
            for (const page of newPages) {
                const embedPage = new IlluminatiEmbed(message, client, {
                    title: "Jono",
                    description: `**Seuraavaksi soi:** ${queue.currentTrack.title} (${queue.currentTrack.author})`,
                    fields: page.map((track) => ({
                        name: `${track.title}`,
                        value: `Lisännyt: ${track.requestedBy.tag}`,
                    })),
                });

                mainPage.addPage(embedPage);
            }
        }

        mainPage.reply();
    },
};
export default command;
