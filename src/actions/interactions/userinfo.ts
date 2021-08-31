import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { IlluminatiInteraction } from "../../types/IlluminatiInteraction";

const data = new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get info about user")
    .addUserOption(option => 
        option.setName("user")
            .setRequired(true)
            .setDescription("User")
    )
    .toJSON();

const interaction: IlluminatiInteraction = {
    data,
    async execute(data: CommandInteraction, client) {
        data.reply("Tämä komento ei vielä toimi")
    },
}

export default interaction