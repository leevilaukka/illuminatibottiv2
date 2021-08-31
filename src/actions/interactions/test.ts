import { CommandInteraction, MessageActionRow, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { IlluminatiClient } from "../../structures";
import { IlluminatiInteraction } from "../../types/IlluminatiInteraction";
import { SlashCommandBuilder } from '@discordjs/builders';

const data = new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command")
    .addStringOption(option => option.setName("viesti").setDescription("Viesti, joka lähettää takaisin"))
    .toJSON();


const interaction: IlluminatiInteraction = {
    data,
    execute: (data: CommandInteraction, client: IlluminatiClient) => {
        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('test:select')
					.setPlaceholder('Nothing selected')
					.addOptions([
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					]),
			);

		data.reply({ content: 'Pong!', components: [row] });
    },
    update: (data: SelectMenuInteraction, client: IlluminatiClient) => {
        console.log(data)
        data.reply(`Valitsit: ${data.values.toString()}`)
    }
}

export default interaction;