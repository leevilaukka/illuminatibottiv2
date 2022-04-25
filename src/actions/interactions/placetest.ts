import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { IlluminatiEmbed } from "../../structures";
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
                description: `${place.location.coordinates[0]} - ${place.location.coordinates[1]}`,
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

        await data.reply({ content: 'Valitse!', components: [row] });
    },
    async update(data: SelectMenuInteraction, client) {
        console.log(data);
        data.deferUpdate();

        let place;
        if (data.customId === 'placetest:place') {
            place = (await client.guildManager(data.guild).getGuild()).places.filter((place) => place.name === data.values[0]);
        }

        if (!place) return

        const embed = new MessageEmbed()
            .setTitle(place[0].name)
            .setDescription(`${place[0].location.coordinates[0]} - ${place[0].location.coordinates[1]}`)
            .setColor(0x00ff00)
            .addField("Description", place[0].description)

        await data.reply({ embeds:[embed] });      
    }
}

export default interaction;