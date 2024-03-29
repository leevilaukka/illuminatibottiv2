import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../../types";

const command: SlashCommand<ChatInputCommandInteraction> = {
    data: new SlashCommandBuilder()
        .setName("shortlink")
        .setDescription("Create a shortlink")
        .addStringOption(option => option.setName("url").setDescription("URL to shorten").setRequired(true))
        .toJSON()
    ,async execute(client, interaction) {
        const url = interaction.options.getString("url");

        const shortenerURL = `${process.env.API_URL}:${process.env.EXPRESS_PORT}/api/sh`;

        await interaction.deferReply();

        client.axios.post(shortenerURL, {
            url: url,
            userID: interaction.user.id,
        }).then(res => {
            const url = res.data.redirectURL;

            interaction.editReply(url);
        }).catch(err => {
            console.error(err);
            interaction.editReply("An error occurred while creating the shortlink:" + err.message || "Unknown error");
        });
    }
}

export default command;