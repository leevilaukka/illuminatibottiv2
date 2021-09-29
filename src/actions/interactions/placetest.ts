import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { IlluminatiInteraction } from "../../types/IlluminatiInteraction";

const data = new SlashCommandBuilder()
    .setName("placetest")
    .setDescription("Get place coordinates")
    .toJSON();


const interaction: IlluminatiInteraction = {
    data,
    async execute(data: CommandInteraction, client) {
        const places = (await client.guildManager(data.guild).getGuild()).places;

        if(!places) return data.reply("No places set up");

        const options = places.map((place) => {
            return {
                label: place.name,
                value: place.name,
                description: `${place.coords.lat} - ${place.coords.lon}`,
            }
        })

        console.log("Places: ", options)
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('placetest:place')
                    .setPlaceholder('Valitse paikka')
                    .addOptions(
                        ...options
                    ),
            );
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('placetest:place2')
                    .setPlaceholder('Valitse toinen paikka')
                    .addOptions(
                        ...options
                    ),
            );

        return data.reply({ content: 'Valitse!', components: [row, row2] });
    },
    async update(data: SelectMenuInteraction, client) {
        console.log(data);
        data.deferUpdate();

        let place1, place2;
        if (data.customId === 'placetest:place') {
            place1 = (await client.guildManager(data.guild).getGuild()).places.filter((place) => place.name === data.values[0]);
        }
        if (data.customId === 'placetest:place2') {
            place2 = (await client.guildManager(data.guild).getGuild()).places.filter((place) => place.name === data.values[0]);
        }

        if (place1 && place2) {
            const embed = new MessageEmbed()
                .setTitle(`${place1.name} / ${place2.name}`)
                .setDescription(`${place1.coords.lat} - ${place1.coords.lon} /${place2.coords.lat} - ${place2.coords.lon} `)

            data.reply({ content: `Paikka`, embeds: [embed] });
        }
    }
}

export default interaction;