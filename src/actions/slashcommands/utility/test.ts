import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../types";

const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command")
        .addStringOption(option => option.setName("test").setDescription("Test option"))
        .toJSON()
    ,async execute(client, interaction) {
        await interaction.reply("Test command");
    }
}

export default command;