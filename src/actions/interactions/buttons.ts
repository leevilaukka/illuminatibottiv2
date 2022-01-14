import { SlashCommandBuilder } from "@discordjs/builders";
import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { IlluminatiInteraction } from "../../types/IlluminatiInteraction";

const data = new SlashCommandBuilder()
    .setName("button")
    .setDescription("Test Buttons")
    .toJSON();

const interaction: IlluminatiInteraction = {
    data,
    async execute(data: CommandInteraction, client) {
        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('button:primary')
					.setLabel('Primary')
					.setStyle('PRIMARY'),
			);

		await data.reply({ content: 'Pong!', components: [row] });
    },
    update(data: ButtonInteraction, client) {
        console.log(data)
        data.reply("Painoit nappia")
    }
}

export default interaction